import express from "express";
import { createClient } from "redis";
import supabase from "./client.js";
import Module from "./main.js";

const app = express();
const client = createClient({
    username: 'default',
    password: 'J3g0ajqINj2CQHupBZEPqPiKKdd1w4Pr',
    socket: {
        host: 'redis-16092.c246.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 16092
    }
});
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
app.use(express.json());

const cpu = await Module();

const INSTRUCTION_DECODER_DAA_WRAPPER = cpu.cwrap(
    "INSTRUCTION_DECODER_DAA_WRAPPER",
    "number",
    ["string", "number", "number"]
);

async function lruSetEx(){
    const exists = await client.exists("lruSet");
    if(!exists){
        const memoryBlocks = ['0x00', '0x01', '0x02', '0x03'];
        for (const block of memoryBlocks) {
            await client.zAdd('lruSet', [{ score: 0, value: block }]);
        }
        console.log("LRU set initialized");
    }
}
await lruSetEx();

async function write(word) {
    try {
        const memoryBlocks = ['0x00', '0x01', '0x02', '0x03'];  
        let targetBlock = null;

        for (let block of memoryBlocks) {
            const value = await client.hGet(block, "data");
            if (value === null || value === undefined) {
                targetBlock = block;
                break;
            }
        }

        if (!targetBlock) {
            const lru = await client.zRange('lruSet', 0, 0);
            if (lru && lru.length > 0) {
                targetBlock = lru[0];
                await client.zRem('lruSet', targetBlock);
            } else {
                throw new Error("LRU set is empty. Cannot select a block.");
            }
        }

        await client.hSet(targetBlock, "data", word);
        const timestamp = Date.now();
        await client.zAdd('lruSet', [{ score: timestamp, value: targetBlock }]);

        await supabase
            .from('main_memory')
            .upsert({ word, address: targetBlock });

        return targetBlock;
    } catch (error) {
        console.error("Write Error", error);
        throw error;
    }
}


app.post("/read", async (req, res) => {
    try {
        const { word } = req.body;
        const cacheArr = ['0x00', '0x01', '0x02', '0x03'];
        const cacheResp = [];
        for(let cache of cacheArr){
            const result = await client.hGet(cache, "data");
            cacheResp.push(result);
        }
        const index = cacheResp.indexOf(String(word));
        if (index !== -1) {
            return res.json({ status: "Cache Hit", position: index });
        }

        const { data, error } = await supabase
            .from("main_memory")
            .select("address")
            .eq("word", word);

        if (error) return res.json({ status: "Error", error });
        if (data.length > 0) return res.json({ status: "Cache Miss", position: data[0].address });
        const newAddress= await write(word)
        return res.json({ status: "Word not present", address: newAddress });

    } catch (error) {
        return res.json({ error: error.message });
    }
});


// alu implementaion and execute stage for executing instruction after accessing data from main memory
// cpu -> run program -> goes to first location -> gets memory address -> checks cache -> if not main memory ..
// depends on r/w instruction
// if write then information word goes to cpu and write operation is initiated

app.post("/compute", async(req, res) => {
    const { alu_opcode, operand_one, operand_two } = req.body;
    const result = await compute(alu_opcode, operand_one, operand_two);
    return res.json(result);
})

async function compute(alu_opcode, operand_one, operand_two){
    try{
        const result = INSTRUCTION_DECODER_DAA_WRAPPER(alu_opcode, operand_one, operand_two);
        return result
    }
    catch(err){
        throw new Error("Compute Routine Failed!")
    }
}

async function readWord(address) {
    const cachedValue = await client.hGet(address, "data");
    if (cachedValue !== null && cachedValue !== undefined && cachedValue !== "null") {
        return parseInt(cachedValue);
    }

    const { data } = await supabase
        .from("main_memory")
        .select("word")
        .eq("address", address);

    if (data && data.length > 0) {
        return parseInt(data[0].word);
    }

    return null;
}

app.post("/execute", async (req, res) => {
    try{
        const detailMap = {};
        const { instruction } = req.body;
        const irArray = instruction.split(" ");
        const operator = irArray[0];
        const op_address_one = irArray[1];
        const op_address_two = irArray[2];
        detailMap["first_la"] = op_address_one;
        detailMap["second_la"] = op_address_two;
        
        let { data: page_table, error } = await supabase
        .from('page_table')
        .select('*')
        console.log(page_table);
        const start_one = performance.now();
        const op1_page_table_access = await supabase
            .from("page_table")
            .select("*")
            .eq("logical_address", op_address_one);
        const op2_page_table_access = await supabase
            .from("page_table")
            .select("*")
            .eq("logical_address", op_address_two);
        const end_one = performance.now();
        detailMap["page table access"] = end_one - start_one;

        if (op1_page_table_access.error || !op1_page_table_access.data || op1_page_table_access.data.length === 0) {
            throw new Error(`Page table lookup failed for logical address: ${op_address_one}`);
        }
        if (op2_page_table_access.error || !op2_page_table_access.data || op2_page_table_access.data.length === 0) {
            throw new Error(`Page table lookup failed for logical address: ${op_address_two}`);
        }


        const start_two = performance.now();
        const physical_addr_1 = op1_page_table_access.data[0].physical_address;
        const physical_addr_2 = op2_page_table_access.data[0].physical_address;
        detailMap["first_pa"]=physical_addr_1;
        detailMap["second_pa"]=physical_addr_2;
        const read_op1 = await readWord(physical_addr_1);
        const read_op2 = await readWord(physical_addr_2);
        const end_two = performance.now();
        detailMap["memory access"] = end_two - start_two;

        const start_three = performance.now();
        const res_comp = await compute(operator, read_op1, read_op2);
        const end_three = performance.now();
        detailMap["compute"] = end_three - start_three;
        detailMap["compute_result"] = res_comp;

        return res.status(200).json(detailMap);
    }
    catch(err){
        return res.status(500).json({"message": err.message});
    }
})


async function load(address, value){
    try{
        const verdict = await supabase.from("main_memory").update({"word": value}).eq("address",address);
        return { message: "Load successful", verdict };
    }
    catch(err){
        throw new Error(`Load failed: ${err.message}`);
    }
}

app.post("/load", async(req, res) => {
    try {
        const { address, value } = req.body;
        const result = await load(address, value);
        return res.status(200).json(result);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
})

app.listen(5000, (err) => {
    if (err) console.error("Server Error!", err);
    else console.log("Server is live on port 5000!");
});