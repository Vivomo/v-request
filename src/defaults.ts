import {AxiosRequestConfig} from './types';
import {processHeaders} from './utils/headers';
import {transformRequest, transformResponse} from './utils/data';

const defaults: AxiosRequestConfig = {
    method: 'GET',
    timeout: 0,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },

    transformRequest: [
        function(data: any, headers: any): any {
            processHeaders(headers, data)
            return transformRequest(data)
        }
    ],

    transformResponse: [
        function(data: any): any {
            return transformResponse(data)
        }
    ],

    validateStatus(status: number): boolean {
        return status >= 200 && status < 300
    }
};

const methodsNoData = ['delete', 'get', 'head', 'options'];

methodsNoData.forEach(method => {
    defaults.headers[method] = {};
});

const methodsWithData = ['post', 'put', 'patch'];

methodsWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

export default defaults;