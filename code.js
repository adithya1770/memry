import express from "express";
import { createClient } from "redis";
import supabase from "./client.js";
import Module from "./main.js";

const app = express();
const client = createClient({
    username: 'default',
    password: 'H8Yf4pmffBpBMsI27BTEEFHsrv2NrDBx',
    socket: {
        host: 'redis-19760.c61.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 19760
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

app.listen(5000, (err) => {
    if (err) console.error("Server Error!", err);
    else console.log("Server is live on port 5000!");
});