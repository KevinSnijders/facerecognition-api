module.exports = require('redis').createClient(tls=process.env.REDIS_URI);

