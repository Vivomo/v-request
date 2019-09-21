import {AxiosPromise, AxiosRequestConfig, AxiosResponse} from '../types';
import xhr from './xhr';
import {buildURL} from '../utils/url';
import {transformRequest, transformResponse} from '../utils/data';
import {flattenHeaders, processHeaders} from '../utils/headers';


const dispatchRequest = (config: AxiosRequestConfig): AxiosPromise => {
    processConfig(config);
    return xhr(config).then(resp => transformResponseData(resp));
};

const processConfig = (config: AxiosRequestConfig): void => {
    config.url = transformURL(config);
    config.headers = transformHeaders(config);
    config.data = transformRequestData(config);
    config.headers = flattenHeaders(config.headers, config.method!);
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

const transformResponseData = (resp: AxiosResponse): AxiosResponse => {
    resp.data = transformResponse(resp.data);
    return resp;
};

export default dispatchRequest;