import axios from 'axios';
import cookie from 'react-cookies';
import clientConfig from "./../config.js";

export function apiHttpClient(path, method = "GET", data = {}) {
    return axios({
        method: method,
        url: `${clientConfig.apiServer.url}${path}`,
        data: data,
        headers: { 'csrf-token': cookie.load("_csrf_token") }
    });
}

export function uiHttpClient(path, method = "GET", data = {}) {
    return axios({
        method: method,
        url: path,
        data: data,
        headers: { 'csrf-token': cookie.load("_csrf_token") }
    });
}