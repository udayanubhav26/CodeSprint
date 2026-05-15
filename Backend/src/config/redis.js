const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19728.crce281.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 19728
    }
});



module.exports = redisClient;