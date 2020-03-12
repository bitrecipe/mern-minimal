let json;

if (process.env.NODE_ENV == 'production' && process.env.APP_ENV == 'production') {
    console.log("production config client");
    json = require('./../../client.json');
} else if (process.env.NODE_ENV == 'production' && process.env.APP_ENV == 'staging') {
    console.log("staging config client");
    json = require('./../../client.stage.json');
} else {
    console.log("dev/test config client");
    json = require('./../../client.dev.json');
}

const clientConfig = {
    apiServer: {
        url: json.apiServer.url || "http://localhost:3000"
    }
};

module.exports = clientConfig;
