import express from "express";
import { createClient } from "redis";
import supabase from "./client.js";

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

async function write(word) {
    // implement the write function here, such that when the word is not present in memory i.e.
    // it shows word not present in memory then it shall write to both cache as well as the main memory
    // to the same location. The flow should be user hits /read -> no word -> call this function.
}

app.post("/read", async (req, res) => {
    try {
        const { word } = req.body;

        const readCache = await client.hmGet('0x00', '0x01', '0x02', '0x03');

        const index = readCache.indexOf(word);
        if (index !== -1) {
            return res.json({ status: "Cache Hit", position: index });
        }

        const { data, error } = await supabase
            .from("main_memory")
            .select("address")
            .eq("word", word);

        if (error) return res.json({ status: "Error", error });
        if (data.length > 0) return res.json({ status: "Cache Miss", position: data[0].address });

        return res.json({ status: "Word not present in Main Memory" });
        // call the function here

    } catch (error) {
        return res.json({ error: error.message });
    }
});

app.listen(5000, (err) => {
    if (err) console.error("Server Error!", err);
    else console.log("Server is live on port 5000!");
});
