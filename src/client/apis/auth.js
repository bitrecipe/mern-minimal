import { apiHttpClient, uiHttpClient } from './../utils/httpClient.js';

export function login(data) {
    return uiHttpClient("/ui/login", "POST", data);
}

export function createUser(data) {
    return apiHttpClient("/api/users", "POST", data);
}