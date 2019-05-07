var json;

if (process.env.NODE_ENV == "production") {
    json = require('./../../client.json');
} else {
    json = require('./../../client.dev.json');
}

const clientConfig = {
    apiServer: {
        url: json.apiServer.url || "http://localhost:3000"
    }
};

module.exports = clientConfig;
