import User from './../models/User.js';
import * as util from "./../utils/util.js";
import logger from './../middlewares/logger.js';

export function authToken(req, res, next) {
    let email = req.body['email'] || "";
    let password = req.body['password'] || "";

    User.findOne({ email }).lean().exec().then(function (doc) {
        if (doc) {
            util.verifyPassword(password, doc.password).then(function (isMatch) {
                if (isMatch) {
                    util.getAuthToken({ userId: doc._id, email: doc.email }).then(function (tokenAndExpiry) {
                        res.json({ data: { email: email, token: tokenAndExpiry.token, expiry: tokenAndExpiry.expiry }, error: null, message: null });
                    }).catch(function (err) {
                        logger.error(err);
                        res.status(500).json({ data: null, error: { subject: "server" }, message: err.toString() });
                    });
                } else {
                    res.status(403).json({ data: null, error: { subject: "password" }, message: "password mismatch" });
                }
            }).catch(function (err) {
                logger.error(err);
                res.status(500).json({ data: null, error: { subject: "server" }, message: err.toString() });
            });
        } else {
            res.status(403).json({ data: null, error: { subject: "email/password" }, message: "invalid email password combo" });
        }
    }).catch(function (err) {
        logger.error(err);
        res.status(500).json({ data: null, error: { subject: "server" }, message: err.toString() });
    });
}

export function validateAuthToken(req, res, next) {
    let authToken = req.body['authToken'] || "";

    util.verifyAuthToken(authToken).then(function(decoded) {
        User.findOne({ _id: decoded.userId }).lean().exec().then(function (doc) {
            if (doc) {
                res.json({
                    data: {
                        session: {
                            userId: doc._id,
                            email: doc.email
                        }
                    },
                    error: null,
                    message: null
                });
            } else {
                res.status(401).json({ error: { subject: "authentication" }, data: null, message: "authentication error" });
            }
        }).catch(function(err) {
            logger.error(err);
            res.status(401).json({ error: { subject: "authentication" }, data: null, message: "authentication error" });
        });
    }).catch(function(err) {
        logger.error(err);
        res.status(401).json({ error: { subject: "authentication" }, data: null, message: "authentication error" });
    });
}

export function createUser(req, res, next) {
    let email = req.body['email'] || "";
    let password = req.body['password'] || "";

    util.hashPassword(password).then(function (hash) {
        const user = new User({ email: email, password: hash });
        return user.save();
    }).then(function (doc) {
        res.json({ data: doc, error: null, message: `user created email: ${email} and _id: ${doc._id}` });
    }).catch(function (err) {
        logger.error(err);
        res.status(500).json({ data: null, error: { subject: "server" }, message: err.toString() });
    });
}

