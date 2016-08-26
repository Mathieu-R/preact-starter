var config = require('./webpack.base')
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ProgressBarPlugin = require('progress-bar-webpack-plugin')

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new ProgressBarPlugin(),
  new ExtractTextPlugin('[name].css')
  //new webpack.optimize.UglifyJsPlugin({
  //  comments: false
  //})
)

// On extrait le CSS
//config.module.loaders[0].loaders = ExtractTextPlugin.extract(config.module.loaders[0].loaders)
