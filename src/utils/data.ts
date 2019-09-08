import {isPlainObject} from './index';

export const transformRequest = (data: any): any => {
    if (isPlainObject(data)) {
        return JSON.stringify(data);
    }
    return data;
};