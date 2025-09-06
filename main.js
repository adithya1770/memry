import { createClient } from 'redis';

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

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

