if (process.env.NODE_ENV == "production") {
    require("./dist/server/server.bundle.js");
} else {
    require("@babel/register");
    require("./src/server/index.js");
}