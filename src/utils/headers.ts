import {deepMerge, isPlainObject} from './index';
import {Method} from '../types';

export const contentType = 'Content-Type';
const jsonContentType = 'application/json;charset=utf-8';

const normalizeHeaderName = (headers: any, normalizedName: string): void => {
    if (!headers) {
        return;
    }
    Object.keys(headers).forEach((name) => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = headers[name];
            delete headers[name];
        }
    })
};

export const processHeaders = (headers: any, data: any): any => {
    normalizeHeaderName(headers, contentType);

    if (isPlainObject(data)) {
        if (!headers[contentType]) {
            headers[contentType] = jsonContentType;
        }
    }

    return headers;
};

export const parseHeaders = (headers: string): any => {
    let result:any = {};
    if (!headers) {
        return result;
    }
    headers.split('\r\n').forEach((line) => {
        let [key, val] = line.split(':');
        key = key.trim().toLowerCase();
        if (!key) {
            return;
        }
        if (val) {
            val = val.trim();
        }
        result[key] = val;
    });
    return result;
};

export const flattenHeaders = (headers: any, method: Method):any => {
    if (!headers) {
        return headers;
    }

    headers = deepMerge(headers.common, headers[method], headers);

    const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
    methodsToDelete.forEach(item => {
        delete headers[item];
    })

    return headers;
};