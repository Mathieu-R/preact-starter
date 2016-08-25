var config = require('./webpack.base')
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ProgressBarPlugin = require('progress-bar-webpack-plugin')

config.plugins = config.plugins.concat([
  new ProgressBarPlugin(),
  new ExtractTextPlugin('[name].[contenthash:8].css'),
  //new webpack.optimize.UglifyJsPlugin({
  //  comments: false
  //})
])

// On extrait le CSS
config.module.loaders[0].loaders = new ExtractTextPlugin.extract(config.module.loaders[0].loaders)
