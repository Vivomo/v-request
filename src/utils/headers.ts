import {isPlainObject} from './index';

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