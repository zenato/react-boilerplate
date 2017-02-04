const { join, relative } = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const processEnv = require('../../utils/processEnv');
const paths = require('./../paths');

const debug = process.env.NODE_ENV === 'development';
const appRoot = process.cwd();

const defaultEnvs = {
  SERVER: true,
  CLIENT: false,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DEV_PORT: process.env.DEV_PORT,
  API_URL: process.env.API_URL,
  STATIC_PATH: relative(appRoot, join(paths.build, 'static')),
  MANIFEST_PATH: relative(appRoot, join(paths.build, paths.manifest)),
};

if (process.env.HEROKU) {
  delete defaultEnvs.PORT;
}

const envs = processEnv(defaultEnvs);

const config = {
  devtool: 'source-map',
  entry: {
    server: [paths.server],
  },
  output: {
    path: paths.build,
    pathinfo: true,
    filename: '[name].js',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  resolveLoader: {
    modules: [paths.ownNodeModules],
    moduleExtensions: ['-loader'],
  },
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: paths.src,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        include: paths.src,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.css$/,
        loader: 'css/locals',
        include: paths.src,
      },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/,
        ],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
          emitFile: false,
        },
      },
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]',
          emitFile: false,
        },
      },
    ],
  },
  node: {
    __dirname: true,
    __filename: true,
  },
  target: 'node',
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin(envs),
    new webpack.LoaderOptionsPlugin({
      options: {
        debug: true,
      },
    }),
  ],
};

// Development config
if (debug) {
  const host = process.env.HOST || 'localhost';

  Object.assign(config.output, {
    pathinfo: true,
    publicPath: `http://${host}:${process.env.DEV_PORT}/`,
  });
}

// Production config
if (!debug) {
  config.bail = true;
}

module.exports = config;
