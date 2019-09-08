import {AxiosRequestConfig} from './types';
import xhr from './xhr';
import {buildURL} from './utils/url';


const axios = (config: AxiosRequestConfig) => {
    processConfig(config);
    xhr(config);
};

const processConfig = (config: AxiosRequestConfig): void => {
    config.url = transformURL(config);
};

const transformURL = (config: AxiosRequestConfig): string => {
    const {url, params} = config;
    return buildURL(url, params);
};

export default axios;