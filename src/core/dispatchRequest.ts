import {AxiosPromise, AxiosRequestConfig, AxiosResponse} from '../types';
import xhr from './xhr';
import {buildURL} from '../utils/url';
import {flattenHeaders} from '../utils/headers';
import transform from './transform';


const dispatchRequest = (config: AxiosRequestConfig): AxiosPromise => {
    processConfig(config);
    return xhr(config).then(resp => transformResponseData(resp));
};

const processConfig = (config: AxiosRequestConfig): void => {
    config.url = transformURL(config);
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flattenHeaders(config.headers, config.method!);
};

const transformURL = (config: AxiosRequestConfig): string => {
    const {url, params} = config;
    return buildURL(url, params);
};

const transformResponseData = (resp: AxiosResponse): AxiosResponse => {
    resp.data = transform(resp.data, resp.headers, resp.config.transformResponse);
    return resp;
};

export default dispatchRequest;