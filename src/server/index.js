import express from "express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import path from "path";
import React from "react";
import { StaticRouter } from "react-router-dom";
import { matchRoutes } from 'react-router-config';
import { Provider } from "react-redux";
import { renderToString } from 'react-dom/server';
import compression from "compression";
import App from "./../client/App.js";
import { configureStore } from './../client/store.js';
import createRoutes from "./../client/routes.js";
import { ChunkExtractor } from '@loadable/server';
import mongoose from 'mongoose';
import axios from "axios";
import serverConfig from "./config.js";
import csrf from "csurf";
import serialize from 'serialize-javascript';
import morgan from 'morgan';
import logger from './middlewares/logger.js';
import authRoutes from './routes/auth.js';
import commonRoutes from './routes/common.js';

mongoose.Promise = global.Promise;

mongoose.connect(serverConfig.mongodb.url, serverConfig.mongodb.options, function (err) {
    if (!err) {
        logger.info("mongodb connected to " + serverConfig.mongodb.url);
        require('./utils/initDB.js');
    } else {
        logger.error(err);
        process.exit(1);
    }
});

const app = express();

app.use(morgan('short', { "stream": logger.stream }));

app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(helmet());
app.use(hpp());
app.use(cookieParser());

var csrfProtection;

if (serverConfig.cookie.domain) {
    csrfProtection = csrf({
        cookie: {
            domain: serverConfig.cookie.domain,
            httpOnly: true
        }
    });
} else {
    csrfProtection = csrf({
        cookie: {
            httpOnly: true
        }
    });
}

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    logger.error(err);
    res.status(403).json({ data: null, error: { subject: "csrf" }, message: "invalid csrf token" });
});

if (process.env.NODE_ENV == 'development') {
    app.use("/public", express.static(path.resolve(__dirname, './../../dist/client'), { maxAge: "10" }));
    app.use("/public", express.static(path.resolve(__dirname, './../../assets'), { maxAge: "10" }));
    var webpack = require('webpack');
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpackClientConfig = require('./../../webpack.config.client.dev.js');
    var compiler = webpack(webpackClientConfig);
    app.use(webpackDevMiddleware(compiler, { noInfo: false, publicPath: webpackClientConfig.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
} else {
    app.use("/public", express.static(path.resolve(__dirname, './../../dist/client'), { maxAge: "30d" }));
    app.use("/public", express.static(path.resolve(__dirname, './../../assets'), { maxAge: "30d" }));
}

/* api server routes (either on this server or a seperate server) */

authRoutes.all('*', csrfProtection);
commonRoutes.all('*', csrfProtection);

app.use("/api", authRoutes);
app.use("/api", commonRoutes);

/* ---------------------------api server routes end-----------------*/

app.post("/ui/login", csrfProtection, function (req, res) {

    var data = req.body;

    axios.post(`${serverConfig.apiServer.url}/api/authToken`, data, { headers: req.headers }).then(function (_res) {
        if (serverConfig.cookie.domain) {
            res.cookie('auth_token', _res.data.data.token, { domain: serverConfig.cookie.domain, expires: new Date(_res.data.data.expiry * 1000), httpOnly: true });
        } else {
            res.cookie('auth_token', _res.data.data.token, { expires: new Date(_res.data.data.expiry * 1000), httpOnly: true });
        }
        res.json({ data: { authenticated: true, email: _res.data.data.email, token: _res.data.data.token, expiry: _res.data.data.expiry }, error: null, message: null });
    }).catch(function (err) {
        logger.error(err);
        res.status(err.response.status).json({ data: null, error: err.response.data.error, message: err.response.data.message });
    });
});

app.post('/ui/logout', csrfProtection, function (req, res, next) {
    if (serverConfig.cookie.domain) {
        res.cookie('auth_token', "", { domain: serverConfig.cookie.domain, expires: new Date(0), httpOnly: true });
    } else {
        res.cookie('auth_token', "", { expires: new Date(0), httpOnly: true });
    }
    res.redirect("/");
});

app.get("/*", csrfProtection, function (req, res) {

    let auth_token = req.cookies.auth_token || null;

    let _csrf_token = req.cookies._csrf_token || null;

    validateAuthToken(auth_token, _csrf_token, req).then(function (session) {

        let initStore = session ? { session } : {};

        const store = configureStore(initStore);

        const branch = matchRoutes(createRoutes(store), req.path);

        if (serverConfig.cookie.domain) {
            res.cookie('_csrf_token', req.csrfToken(), { domain: serverConfig.cookie.domain, expires: new Date(new Date().getTime() + (serverConfig.csrf.expiry * 1000)) });
        } else {
            res.cookie('_csrf_token', req.csrfToken(), { expires: new Date(new Date().getTime() + (serverConfig.csrf.expiry * 1000)) });
        }

        const promises = branch.map(({ route, match }) => {
            if (route.loadData) {
                return Promise.all(
                    route.loadData({ params: match.params, getState: store.getState }).map(item => store.dispatch(item))
                );
            }
            return Promise.resolve(null);
        });

        return Promise.all(promises).then((data) => {

            let context = {};

            const statsFile = path.resolve(__dirname, "./../../dist/client/loadable-stats.json");

            const extractor = new ChunkExtractor({ statsFile, entrypoints: ["app"] });

            const jsx = extractor.collectChunks(
                <Provider store={store}>
                    <StaticRouter context={context} location={req.url}>
                        <App />
                    </StaticRouter>
                </Provider>
            );

            if (context.status === 404) {
                return res.status(404);
            }

            if (context.status === 302) {
                return res.redirect(302, context.url);
            }

            const reactDom = renderToString(jsx);
            const reduxState = store.getState();

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(renderFullPage(reactDom, reduxState, extractor));

        }).catch((err) => {
            logger.error(err);
            return res.status(500).end(err.toString());
        });
    });

});


function validateAuthToken(auth_token, _csrf_token, req) {
    return new Promise(function (resolve, reject) {
        if (auth_token && _csrf_token) {
            axios.post(`${serverConfig.apiServer.url}/api/validateAuthToken?authToken=${auth_token}`, { authToken: auth_token }, { headers: req.headers }).then(function (res) {
                resolve({
                    authenticated: true,
                    email: res.data.data.session.email,
                    userId: res.data.data.session.userId
                });
            }).catch(function (err) {
                logger.error(err);
                resolve(null);
            });
        } else {
            resolve(null);
        }
    });
}


function renderFullPage(html, preloadedState, extractor) {

    const scriptTags = extractor.getScriptTags();

    // const linkTags = extractor.getLinkTags();

    const styleTags = extractor.getStyleTags();

    return `
    <!doctype html>
    <html>
      <head>

        <title>mern-minimal</title>

        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>

        <link rel="icon" href="/public/images/favicon.png" type="image/gif" sizes="16x16"/>

        <!--[if IE gt 8]>
        <script crossorigin="anonymous" src="https://polyfill.io/v3/polyfill.min.js?features=EventSource"></script>
        <![endif]-->

        ${styleTags}
        
      </head>
      <body>
        <div id="app">${html}</div>

        <script>
          window.__INITIAL_STATE__ = ${serialize(preloadedState)}
        </script>

        ${scriptTags}

      </body>
    </html>
    `
}

app.listen(serverConfig.port, serverConfig.host, () => {
    logger.info(`${process.env.NODE_ENV} app listening on port ${serverConfig.port}@${serverConfig.host}`);
});