import User from './../models/User.js';
import * as util from "./../utils/util.js";

export function authenticate() {
    return function (req, res, next) {
        req.session = {};
        var AuthToken = req.cookies.auth_token || null;
        if (AuthToken) {
            util.verifyAuthToken(AuthToken).then(function (decoded) {
                User.findOne({ _id: decoded.userId }).lean().exec(function (err, user) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: { subject: "server" }, data: null, message: err.toString() });
                    } else {
                        if (user) {
                            req.session = {
                                userId: decoded.userId,
                                email: user.email
                            }
                            next();
                        } else {
                            res.status(401).json({ error: { subject: "authentication" }, data: null, message: "authentication error" });
                        }
                    }
                });
            }).catch(function (err) {
                console.log(err);
                res.status(401).json({ error: { subject: "authentication" }, data: null, message: "authentication error" });
            });
        } else {
            res.status(401).json({ error: { subject: "authentication" }, data: null, message: "authentication error" });
        }
    }
}