

const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '8888';

loaders.push({
  test: /\.scss$/,
  loaders: ['style-loader', 'css-loader?importLoaders=1', 'sass-loader'],
  exclude: ['node_modules'],
});

const outputPath = path.join(__dirname, 'public');

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.jsx', // your app's entry point
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
  output: {
    publicPath: '/',
    path: outputPath,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders,
  },
  devServer: {
    contentBase: './public',
    // do not print bundle build stats
    noInfo: true,
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    port: PORT,
    host: HOST,
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
    }),
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: ['bundle.js'],
      },
    }),
    new WorkboxPlugin({
      globDirectory: outputPath,
      globPatterns: ['**/*.{html,js}'],
      swDest: path.join(outputPath, 'sw.js'),
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
};
