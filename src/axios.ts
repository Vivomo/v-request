import {AxiosRequestConfig, AxiosStatic} from './types';
import Axios from './core/Axios';
import {extend} from './utils';
import defaults from './defaults';
import mergeConfig from './core/mergeConfig';

const createInstance = (config: AxiosRequestConfig): AxiosStatic => {
    const context = new Axios(config);
    const instance  = Axios.prototype.request.bind(context);
    // console.log(instance, context);
    extend(instance, context);
    return instance;
};

const axios = createInstance(defaults);

axios.create = (config) => {
    return createInstance(mergeConfig(defaults, config));
};

export default axios;