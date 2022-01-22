import config, { apiEndpoints } from './../../config';
import axios from 'axios';

const prefixEndpoint = config.apiBaseURL

const instance = axios.create({
    baseURL: prefixEndpoint,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const api = instance