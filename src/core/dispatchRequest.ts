import {AxiosPromise, AxiosRequestConfig, AxiosResponse} from '../types';
import xhr from './xhr';
import {buildURL, combineURL, isAbsoluteURL} from '../utils/url';
import {flattenHeaders} from '../utils/headers';
import transform from './transform';


const dispatchRequest = (config: AxiosRequestConfig): AxiosPromise => {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr(config).then(resp => transformResponseData(resp));
};

const processConfig = (config: AxiosRequestConfig): void => {
    config.url = transformURL(config);
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flattenHeaders(config.headers, config.method!);
};

const transformURL = (config: AxiosRequestConfig): string => {
    let {url, params, paramsSerializer, baseURL} = config;
    if (baseURL && !isAbsoluteURL(url!)) {
        url = combineURL(baseURL, url);
    }
    return buildURL(url!, params, paramsSerializer);
};

const transformResponseData = (resp: AxiosResponse): AxiosResponse => {
    resp.data = transform(resp.data, resp.headers, resp.config.transformResponse);
    return resp;
};

const throwIfCancellationRequested = (config: AxiosRequestConfig): void => {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
};

export default dispatchRequest;