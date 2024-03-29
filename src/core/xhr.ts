import {AxiosPromise, AxiosRequestConfig, AxiosResponse} from '../types';
import {contentType, parseHeaders} from '../utils/headers';
import {createError} from '../utils/error';
import {isURLSameOrigin} from '../utils/url';
import cookie from '../utils/cookie';
import {isFormData} from '../utils';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise(((resolve, reject) => {
        const {data = null, url, method = 'GET', headers = {}, responseType, timeout, cancelToken, withCredentials,
            xsrfCookieName, xsrfHeaderName, onDownloadProgress, onUploadProgress, auth, validateStatus,
            paramsSerializer} = config;

        const request = new XMLHttpRequest();

        request.open(method.toUpperCase(), url!, true);

        configureRequest();

        addEvents();

        processHeaders();

        processCancel();

        request.send(data);

        function addEvents(): void {
            request.onerror = () => {
                reject(createError('Network Error', config, null, request));
            };

            request.ontimeout = () => {
                reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABOARTED', request));
            };

            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress
            }

            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress
            }

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
        }

        function processCancel(): void {
            if (cancelToken) {
                cancelToken.promise
                    .then(reason => {
                        request.abort()
                        reject(reason)
                    })
                    .catch(
                        /* istanbul ignore next */
                        () => {
                            // do nothing
                        }
                    )
            }
        }

        function configureRequest(): void {
            if (responseType) {
                request.responseType = responseType
            }

            if (timeout) {
                request.timeout = timeout
            }

            if (withCredentials) {
                request.withCredentials = withCredentials
            }
        }

        function processHeaders(): void {
            if (isFormData(data)) {
                delete headers['Content-Type']
            }

            if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName)
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue
                }
            }

            if (auth) {
                headers.Authorization = 'Basic ' + btoa(auth.username + ':' + auth.password)
            }

            Object.keys(headers).forEach(name => {
                if (data === null && name.toLowerCase() === contentType.toLowerCase()) {
                    delete headers[name]
                } else {
                    request.setRequestHeader(name, headers[name])
                }
            });
        }

        const handleResponse = (response: AxiosResponse): void => {
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response);
            } else {
                reject(createError(`Request failed with status code ${response.status}`, config, null, request, response));
            }
        }
    }));
}