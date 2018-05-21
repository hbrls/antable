const path = require('path');
const { DefinePlugin, DllReferencePlugin, optimize: { UglifyJsPlugin } } = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


const PUBLIC_PATH = '/atable/dist/';


module.exports = {
  entry: {
    simple: './docs/src/simple',
  },

  resolve: {
    modules: [path.resolve(__dirname, 'docs/src'), 'node_modules'],
    extensions: ['.js', '.jsx'],
  },

  output: {
    filename: '[name]-[hash:5].js',
    chunkFilename: 'chunk-[name]-[chunkhash:5].js',
    path: path.resolve('docs/dist'),
    publicPath: PUBLIC_PATH,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 50000,
            }
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: false,
                localIdentName: '[name]-[local]-[hash:5]',
                safe: true,
                autoprefixer: {
                  add: true,
                  // browser: [],
                },
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        })
      },
    ],
  },

  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new AssetsPlugin({
      processOutput: assets => JSON.stringify(assets).replace(new RegExp(PUBLIC_PATH, 'ig'), ''),
    }),
    new UglifyJsPlugin({
      mangle: {
        screw_ie8: true,
      },
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new ExtractTextPlugin('[name]-[hash:5].css'),
  ],
};
