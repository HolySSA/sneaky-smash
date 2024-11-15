import camelCase from 'lodash/camelCase.js';

/**
 * 스네이크 케이스 => 카멜 케이스로 변환하는 함수
 * @param {*} obj
 * @returns
 */
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[camelCase(key)] = toCamelCase(obj[key]);
      return result;
    }, {});
  }

  return obj;
};

export default toCamelCase;
