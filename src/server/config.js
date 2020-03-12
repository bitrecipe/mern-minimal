let json;

if (process.env.NODE_ENV == 'production' && process.env.APP_ENV == 'production') {
    console.log("production config server");
    json = require('./../../server.json');
} else if (process.env.NODE_ENV == 'production' && process.env.APP_ENV == 'staging') {
    console.log("staging config server");
    json = require('./../../server.stage.json');
} else {
    console.log("dev/test config server");
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
        url: (function () {
            let _mongoUrl = json.mongodb.url || 'mongodb://localhost:27017/mern-minimal';
            _mongoUrl = `${_mongoUrl}?`;
            if (json.mongodb.user || json.mongodb.pass) {
                _mongoUrl = `${_mongoUrl}authMechanism=DEFAULT&`;
            }
            if (json.mongodb.replicaSet) {
                _mongoUrl = `${_mongoUrl}readPreference=secondaryPreferred&replicaSet=${json.mongodb.replicaSet}`;
            }
            return _mongoUrl;
        })(),
        options: (function () {
            let _mongoOpts = { poolSize: json.mongodb.poolSize || 5, useNewUrlParser: true, useUnifiedTopology: true, ssl: json.mongodb.ssl || false };
            if (json.mongodb.user || json.mongodb.pass) {
                _mongoOpts["user"] = json.mongodb.user;
                _mongoOpts["pass"] = json.mongodb.pass;
            }
            if (json.mongodb.ssl) {
                if (!json.mongodb.sslCA) {
                    throw new Error("valid ca file required");
                }
                _mongoOpts["sslValidate"] = true;
                _mongoOpts["sslCA"] = [fs.readFileSync(path.resolve(__dirname, `./../../sslcert/mongo_ca.ca-bundle`))];
            }
            return _mongoOpts;
        })()
    }
}

module.exports = serverConfig;