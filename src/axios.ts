import {AxiosInstance, AxiosRequestConfig} from './types';
import Axios from './core/Axios';
import {extend} from './utils';
import defaults from './defaults';

const createInstance = (config: AxiosRequestConfig): AxiosInstance => {
    const context = new Axios(config);
    const instance  = Axios.prototype.request.bind(context);
    // console.log(instance, context);
    extend(instance, context);
    return instance;
};

const axios = createInstance(defaults);

export default axios;