var config = require('./webpack.base')
var webpack = require("webpack")

config.devtool = 'cheap-module-eval-source-map'
config.entry.app.unshift("./dev-client.js");

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
)

module.exports = config
