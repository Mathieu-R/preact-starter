var config = require('./webpack.base')
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var extractCSS = new ExtractTextPlugin('[name].css')

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new ProgressBarPlugin(),
  extractCSS
  //new webpack.optimize.UglifyJsPlugin({
  //  comments: false
  //})
)

// On extrait le CSS
config.module.loaders.forEach((loader) => {
    /*if (config.vue) {
        config.vue.loaders.css = extractCSS.extract('css')
    }*/
    if (loader.loaders && loader.loaders.includes('css')) {
        loader.loader = extractCSS.extract(loader.loaders)
    }
})

module.exports = config
