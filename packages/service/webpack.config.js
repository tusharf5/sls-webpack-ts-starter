/* eslint-disable */
'use strict';
const fs = require('fs');
const path = require('path');

const { DefinePlugin } = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const slsw = require('serverless-webpack');

if (slsw.lib.webpack.isLocal) {
  console.log('Running locally');
}

module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimize: !slsw.lib.webpack.isLocal,
    mangleExports: !slsw.lib.webpack.isLocal,
  },
  externalsPresets: { node: true },
  target: 'node',
  devtool: false,
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  stats: {
    modules: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      GLOBAL_VAR_SERVICE_NAME: JSON.stringify(slsw.lib.serverless.service.service),
    }),
  ],
};
