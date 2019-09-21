import {isDate, isPlainObject, isURLSearchParams} from './index';

interface URLOrigin {
    protocol: string
    host: string
}

const encode = (val: string): string =>
    encodeURIComponent(val).replace(/%40/g, '@')
        .replace(/%40/g, '@')
        .replace(/%3A/ig, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/g, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/g, '[')
        .replace(/%5D/g, ']');

export function buildURL(url: string, params?: any, paramsSerializer?: (params: any) => string): string {
    if (!params) {
        return  url;
    }

    let serializedParams;

    if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
    } else if (isURLSearchParams(params)) {
        serializedParams = params.toString();
    } else {
        const parts: string[] = [];
        Object.entries(params).forEach(([key, val]) => {
            if (val === null || val === undefined) {
                return;
            }
            let values = [];
            if (Array.isArray(val)) {
                values = val;
                key += '[]';
            } else {
                values = [val];
            }
            values.forEach((val) => {
                let _val = val;
                if (isDate(val)) {
                    _val = val.toISOString();
                } else if (isPlainObject(val)) {
                    _val = JSON.stringify(val);
                }
                parts.push(`${encode(key)}=${encode(_val)}`)
            })
        });

        serializedParams = parts.join('&');
    }

    if (serializedParams) {
        const hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
            url = url.slice(0, hashIndex);
        }
        url += (url.includes('?') ? '&' : '?') + serializedParams;
    }

    return url;
}

export function isAbsoluteURL(url: string): boolean {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: string): string {
    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

export function isURLSameOrigin(requestURL: string): boolean {
    const parsedOrigin = resolveURL(requestURL)
    return parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host

}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
    urlParsingNode.setAttribute('href', url)
    const { protocol, host } = urlParsingNode

    return {
        protocol,
        host
    }
}