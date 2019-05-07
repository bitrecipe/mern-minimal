import { apiHttpClient, uiHttpClient } from './../utils/httpClient.js';

export function getCountries() {
    return apiHttpClient("/api/countries", "POST");
}