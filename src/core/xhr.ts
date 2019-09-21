import {AxiosPromise, AxiosRequestConfig, AxiosResponse} from '../types';
import {contentType, parseHeaders} from '../utils/headers';
import {createError} from '../utils/error';
import {isURLSameOrigin} from '../utils/url';
import cookie from '../utils/cookie';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise(((resolve, reject) => {
        const {data = null, url, method = 'GET', headers, responseType, timeout, cancelToken, withCredentials,
            xsrfCookieName, xsrfHeaderName} = config;
        const request = new XMLHttpRequest();

        if (responseType) {
            request.responseType = responseType;
        }

        if (timeout) {
            request.timeout = timeout;
        }

        if (withCredentials) {
            request.withCredentials = withCredentials;
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
            reject(createError('Network Error', config, null, request));
        };

        request.ontimeout = () => {
            reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABOARTED', request));
        };

        if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
            const xsrfValue = cookie.read(xsrfCookieName);
            if (xsrfValue) {
                headers[xsrfHeaderName] = xsrfValue;
            }
        }

        Object.entries(headers).forEach(([name, val]: [string, string]) => {
            if (data === null && name.toLowerCase() === contentType.toLowerCase()) {
                delete headers[name]
            } else {
                request.setRequestHeader(name, val)
            }
        });

        if (cancelToken) {
            cancelToken.promise.then((reason) => {
                request.abort();
                reject(reason);
            });
        }

        request.send(data);

        const handleResponse = (response: AxiosResponse): void => {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else {
                reject(createError(`Request failed with status code ${response.status}`, config, null, request, response));
            }
        }
    }));
}