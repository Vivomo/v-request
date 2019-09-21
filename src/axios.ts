import {AxiosRequestConfig, AxiosStatic} from './types';
import Axios from './core/Axios';
import {extend} from './utils';
import defaults from './defaults';
import mergeConfig from './core/mergeConfig';
import CancelToken from './cancel/CancelToken';
import Cancel, {isCancel} from './cancel/Cancel';

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

axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;

export default axios;