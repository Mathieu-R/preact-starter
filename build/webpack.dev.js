var config = require('./webpack.base')
var webpack = require("webpack")
var HtmlWebpackPlugin = require('html-webpack-plugin')

config.devtool = 'cheap-module-eval-source-map'
config.entry.app.unshift("./dev-client.js");

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true
  })
)

module.exports = config
