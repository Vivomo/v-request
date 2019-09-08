const toString = Object.prototype.toString;

export const isDate = (val: any): val is Date => toString.call(val) === '[object Date]';

export const isObject = (val: any): val is Object => val !== null && typeof val === 'object';