const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const processEnv = require('../../utils/processEnv');
const paths = require('../paths');

const debug = process.env.NODE_ENV === 'development';

const envs = processEnv({
  SERVER: false,
  CLIENT: true,
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.API_URL,
});

const config = {
  entry: [
    paths.polyfills,
    paths.client
  ],
  output: {
    path: paths.build,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: paths.src,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: paths.src,
      },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
        ],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
    ],
  },
  node: {
    __dirname: true,
  },
  plugins: [
    new webpack.DefinePlugin(envs),
  ],
};

// Development config
if (debug) {
  const host = process.env.HOST || 'localhost';

  config.devtool = 'source-map';
  config.entry.unshift(require.resolve('react-hot-loader/patch'));
  config.entry.unshift(require.resolve('../../utils/webpackDevClient'));

  config.performance = Object.assign({}, config.performance, {
    hints: false,
  });

  Object.assign(config.output, {
    pathinfo: true,
    filename: 'static/js/[name].js',
    publicPath: `http://${host}:${process.env.DEV_PORT}/`,
  });

  config.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
          plugins: () => [
            autoprefixer({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
            }),
          ],
        },
      },
    ],
  });

  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
  config.plugins.push(new webpack.NamedModulesPlugin());
}

// Production config
if (!debug) {
  config.bail = true;
  config.devtool = 'source-map';

  Object.assign(config.output, {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
  });

  config.module.rules.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
            plugins: () => [
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9', // React doesn't support IE8 anyway
                ],
              }),
            ],
          },
        },
      ],
    }),
  });

  config.plugins.push(new ExtractTextPlugin('static/css/[name].[contenthash:8].css'));
  config.plugins.push(new ManifestPlugin({ fileName: paths.manifest }));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compressor: {
      screw_ie8: true,
      warnings: false,
    },
    mangle: {
      screw_ie8: true,
    },
    output: {
      comments: false,
      screw_ie8: true,
    },
    sourceMap: true,
  }));
  config.plugins.push(new webpack.LoaderOptionsPlugin({
    options: {
      postcss: {
        plugins: [autoprefixer],
      },
    },
  }));
}

module.exports = config;
