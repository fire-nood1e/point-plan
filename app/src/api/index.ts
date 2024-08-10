import axios from 'axios';

export const ax = axios.create({
    baseURL: 'https://point-plan.buttercrab.net/api',
    timeout: undefined,
});
