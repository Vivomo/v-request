import {isDate, isPlainObject} from './index';

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

export function buildURL(url: string, params?: any): string {
    if (!params) {
        return  url;
    }

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

    let serializedParams = parts.join('&');
    if (serializedParams) {
        const hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
            url = url.slice(0, hashIndex);
        }
        url += (url.includes('?') ? '&' : '?') + serializedParams;
    }

    return url;
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