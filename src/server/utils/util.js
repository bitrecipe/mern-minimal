import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
var bcrypt = require('bcryptjs');
import serverConfig from "./../config.js";

export function hashPassword(password) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

export function verifyPassword(password, hash) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, hash, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export function getJwt(payload, opt) {
    return new Promise(function (resolve, reject) {
        jwt.sign(payload, serverConfig.cookie.secretKey, opt, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

export function verifyJwt(token, opt) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, serverConfig.cookie.secretKey, opt, function (err, decoded) {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

export function getAuthToken(payload) {
    return new Promise(function (resolve, reject) {
        var opt = {
            algorithm: "HS256",
            expiresIn: `${serverConfig.cookie.expiry / 60}m`,
            audience: serverConfig.name,
            issuer: serverConfig.name,
            subject: payload.email
        }
        getJwt(payload, opt).then(function (token) {
            var tkn = jwt.decode(token);
            resolve({ token: token, expiry: tkn.exp });
        }).catch(function (err) {
            reject(err);
        });
    });
}

export function verifyAuthToken(token) {
    var opt = {
        algorithms: ["HS256"],
        audience: serverConfig.name,
        issuer: serverConfig.name,
        ignoreExpiration: false
    }
    return verifyJwt(token, opt);
}