module.exports = function (env) {
  return Object.keys(env).reduce((res, key) => {
    res[`process.env.${key}`] = JSON.stringify(env[key]);
    return res;
  }, {});
};
