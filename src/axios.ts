import {AxiosInstance} from './types';
import Axios from './core/Axios';
import {extend} from './utils';

const createInstance = (): AxiosInstance => {
    const context = new Axios();
    const instance  = Axios.prototype.request.bind(context);
    // console.log(instance, context);
    extend(instance, context);
    return instance;
};

const axios = createInstance();

export default axios;