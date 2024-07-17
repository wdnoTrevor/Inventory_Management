const _ = require('lodash');

function NestObject(obj) {
  const result = {};
  Object.keys(obj).forEach(key => {
    if (key.includes('.')) {
      _.set(result, key, obj[key]);
    } else {
      result[key] = obj[key];
    }
  });
  return result;
}

module.exports = NestObject;
