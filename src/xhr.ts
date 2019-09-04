import {AxiosRequestConfig} from './types';

export default function xhr(config: AxiosRequestConfig) {
    const {data = null, url, method = 'GET'} = config;
    const request = new XMLHttpRequest();

    request.open(method.toUpperCase(), url, data, true);
    request.send(data);
}