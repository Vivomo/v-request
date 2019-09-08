import {AxiosRequestConfig} from './types';
import {contentType} from './utils/headers';

export default function xhr(config: AxiosRequestConfig) {
    const {data = null, url, method = 'GET', headers} = config;
    const request = new XMLHttpRequest();

    request.open(method.toUpperCase(), url, true);

    console.log(headers)
    Object.entries(headers).forEach(([name, val]: [string, string]) => {
        if (data === null && name.toLowerCase() === contentType.toLowerCase()) {
            delete headers[name]
        } else {
            request.setRequestHeader(name, headers[name])
        }
    });
    request.send(data);
}