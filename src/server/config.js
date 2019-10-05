var json;

if (process.env.NODE_ENV == "production") {
    json = require('./../../server.json');
} else {
    json = require('./../../server.dev.json');
}

const serverConfig = {
    name: json.name || "mern-minimal",
    host: json.host || "localhost",
    port: json.port || 3000,
    cookie: {
        domain: json.cookie.domain || null,
        secretKey: json.cookie.secretKey || "cookie_sign_token",
        expiry: json.cookie.expiry || 432000 // in seconds
    },
    log: {
        output: json.log.output || "console, file",
        level: json.log.level || "info",
        colorize: json.log.colorize || false
    },
    csrf: {
        expiry: json.csrf.domain || 3600
    },
    apiServer: {
        url: json.apiServer.url || "http://localhost:3000"
    },
    mongodb: {
        url: json.mongodb.url || 'mongodb://localhost:27017/mern-minimal',
        options: { 
            poolSize: json.mongodb.poolSize || 10, 
            useNewUrlParser: true, 
            useCreateIndex: true 
        }
    },
}

module.exports = serverConfig;