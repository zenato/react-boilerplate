const path = require('path');

const appRoot = process.cwd();
const resolveApp = relativePath => path.join(appRoot, relativePath);
const resolveOwn = relativePath => path.join(__dirname, relativePath);

module.exports = {
  src: resolveApp('src'),
  server: resolveApp('src/server'),
  client: resolveApp('src/client'),
  build: resolveApp('build'),
  nodeModules: resolveApp('node_modules'),
  testsSetup: resolveApp('src/testsSetup.js'),
  polyfills: resolveOwn('polyfills'),
  ownNodeModules: resolveOwn('../../node_modules'),
  webpackClientConfig: resolveOwn('./webpack/client.js'),
  webpackServerConfig: resolveOwn('./webpack/server.js'),
  manifest: 'asset-manifest.json',
};
