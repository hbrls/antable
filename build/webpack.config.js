const path = require('path');
const { HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } = require('webpack');

const DEV_SERVER = 'webpack-dev-server/client?http://0.0.0.0:3001';
const HOT_SERVER = 'webpack/hot/only-dev-server';


module.exports = {
  entry: {
    index: [DEV_SERVER, HOT_SERVER, './example/index']
  },

  resolve: {
    modules: [path.resolve(__dirname, 'example'), 'node_modules'],
    extensions: ['.js', '.jsx'],
  },

  output: {
    filename: '[name].js',
    publicPath: 'http://0.0.0.0:3001/static/js/',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

  devtool: 'cheap-module-eval-source-map',

  plugins: [
    new HotModuleReplacementPlugin(),
    new NoEmitOnErrorsPlugin(),
  ],

  devServer: {
    host: '0.0.0.0',
    port: 3001,
    contentBase: path.join(__dirname, 'example'),
    historyApiFallback: true,
    hot: true,
    stats: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
};
