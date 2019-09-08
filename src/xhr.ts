import {AxiosPromise, AxiosRequestConfig, AxiosResponse} from './types';
import {contentType, parseHeaders} from './utils/headers';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise(((resolve, reject) => {
        const {data = null, url, method = 'GET', headers, responseType, timeout} = config;
        const request = new XMLHttpRequest();

        if (responseType) {
            request.responseType = responseType;
        }

        if (timeout) {
            request.timeout = timeout;
        }

        request.open(method.toUpperCase(), url, true);

        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return;
            }
            if (request.status === 0) {
                return;
            }
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
            handleResponse(response);
        };

        request.onerror = () => {
            reject(new Error('Network Error'));
        };

        request.ontimeout = () => {
            reject(new Error(`Timeout of ${timeout} ms exceeded`));
        };

        Object.entries(headers).forEach(([name, val]: [string, string]) => {
            if (data === null && name.toLowerCase() === contentType.toLowerCase()) {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }
        });
        request.send(data);

        const handleResponse = (response: AxiosResponse): void => {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else {
                reject(new Error(`Request failed with status code ${response.status}`));
            }
        }
    }));
}