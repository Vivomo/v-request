import {AxiosPromise, AxiosRequestConfig} from './types';
import xhr from './xhr';
import {buildURL} from './utils/url';
import {transformRequest} from './utils/data';
import {processHeaders} from './utils/headers';


const axios = (config: AxiosRequestConfig): AxiosPromise => {
    processConfig(config);
    return xhr(config);
};

const processConfig = (config: AxiosRequestConfig): void => {
    config.url = transformURL(config);
    config.headers = transformHeaders(config);
    config.data = transformRequestData(config);
};

const transformURL = (config: AxiosRequestConfig): string => {
    const {url, params} = config;
    return buildURL(url, params);
};

const transformRequestData = (config: AxiosRequestConfig): any => {
    return transformRequest(config.data);
};

const transformHeaders = (config: AxiosRequestConfig): any => {
    const {headers = {}, data} = config;
    return processHeaders(headers, data);
};

export default axios;