import {AxiosPromise, AxiosRequestConfig, AxiosResponse} from './types';
import {contentType, parseHeaders} from './utils/headers';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve => {
        const {data = null, url, method = 'GET', headers, responseType} = config;
        const request = new XMLHttpRequest();

        if (responseType) {
            request.responseType = responseType;
        }

        request.open(method.toUpperCase(), url, true);

        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                const responseHeaders = parseHeaders(request.getAllResponseHeaders());
                const responseData = responseType === 'text' ? request.responseText : request.response;
                const response: AxiosResponse = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config,
                    request
                };
                resolve(response);
            }
        };

        Object.entries(headers).forEach(([name, val]: [string, string]) => {
            if (data === null && name.toLowerCase() === contentType.toLowerCase()) {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }
        });
        request.send(data);
    }));
}