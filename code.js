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
        const index = cacheResp.indexOf(word);
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
    const result = INSTRUCTION_DECODER_DAA_WRAPPER(alu_opcode, operand_one, operand_two);
    res.json({ alu_opcode, operand_one, operand_two, result });
})

async function readWord(address) {
    const cachedValue = await client.hGet(address, "data");
    if (cachedValue !== null && cachedValue !== undefined) {
        return parseInt(cachedValue);
    }

    const { data } = await supabase
        .from("main_memory")
        .select("word")
        .eq("address", address);

    if (data && data.length > 0) {
        return parseInt(data[0].word);
    }

    // ISSUUE IN CONSISTENCY JUST CHANGE IT TO return null remove both lines
    await write(0);
    return 0;
}

app.post("/execute", async (req, res) => {
    const { instruction } = req.body;

    res.setHeader("Content-Type", "text/event-stream");

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    try {
        const [opcode, op1Logical, op2Logical] = instruction.split(" ");
        const logicalAddr1 = op1Logical.replace("#", "");
        const logicalAddr2 = op2Logical.replace("#", "");

        res.write(`data: Instruction parsed\n\n`);
        await sleep(500);

        const { data: page1 } = await supabase
            .from("page_table")
            .select("physical_address")
            .eq("logical_address", logicalAddr1);
        res.write(`data: Physical memory access for operand 1\n\n`);
        await sleep(500);

        const { data: page2 } = await supabase
            .from("page_table")
            .select("physical_address")
            .eq("logical_address", logicalAddr2);
        res.write(`data: Physical memory access for operand 2\n\n`);
        await sleep(500);

        if (!page1.length || !page2.length) throw new Error("Logical address not found");

        const physicalAddr1 = page1[0].physical_address;
        const physicalAddr2 = page2[0].physical_address;

        res.write(`data: Retrieved addresses from page table\n\n`);
        await sleep(500);

        const operand_one = await readWord(physicalAddr1);
        const operand_two = await readWord(physicalAddr2);
        res.write(`data: Read operation successful: operand_one=${operand_one}, operand_two=${operand_two}\n\n`);
        await sleep(500);

        const result = INSTRUCTION_DECODER_DAA_WRAPPER(opcode, operand_one, operand_two);
        res.write(`data: ALU executed instruction: result=${result}\n\n`);
        await sleep(500);

        res.write(`data: Execution finished\n\n`);

        res.write("event: end\ndata: done\n\n");
        res.end();

    } catch (err) {
        res.write(`data: Error: ${err.message}\n\n`);
        res.write("event: end\ndata: done\n\n");
        res.end();
    }
});


app.listen(5000, (err) => {
    if (err) console.error("Server Error!", err);
    else console.log("Server is live on port 5000!");
});