import {AxiosRequestConfig} from './types';
import xhr from './xhr';
import {buildURL} from './utils/url';
import {transformRequest} from './utils/data';


const axios = (config: AxiosRequestConfig) => {
    processConfig(config);
    xhr(config);
};

const processConfig = (config: AxiosRequestConfig): void => {
    config.url = transformURL(config);
    config.data = transformRequestData(config);
};

const transformURL = (config: AxiosRequestConfig): string => {
    const {url, params} = config;
    return buildURL(url, params);
};

const transformRequestData = (config: AxiosRequestConfig): any => {
    return transformRequest(config.data);
};

export default axios;