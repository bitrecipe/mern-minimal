if (process.env.NODE_ENV == "production") {
    require("./dist/server/server.bundle.js");
} else {
    var webpack = require('webpack');
    var nodemon = require('nodemon');
    var watch = require('node-watch');
    var path = require('path');
    var webpackServerConfig = require('./webpack.config.server.dev.js');
    var compiler = webpack(webpackServerConfig);

    function build(init) {
        compiler.run(function (err, stats) {
            if (stats) {
                console.log(stats.toString({
                    colors: true,
                    entrypoints: true
                }));
            }
            if (init) {
                observe();
            }
            run(init);
        });
    }

    function observe() {
        watch(path.resolve(__dirname, "./src/server"), { recursive: true }, function (evt, name) {
            console.log("server code", evt, name);
            build(false);
        });
    }

    function run(init) {
        if (init) {
            nodemon({
                script: path.resolve(__dirname, "./dist/server/server.bundle.js")
            }).on('log', function ({ colour }) {
                console.log(colour);
            });
        } else {
            nodemon.emit('restart');
        }
    }

    build(true);
}