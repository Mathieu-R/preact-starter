var webpack = require('webpack');
var config = require('./webpack.dev.js')
var webpackDevServer = require('webpack-dev-server')
var chokidar = require('chokidar')
var compiler = webpack(config)
var port = 8081
config.entry.app.unshift("webpack-hot-middleware/client")
var hotMiddleware = require("webpack-hot-middleware")(compiler)

var server = new webpackDevServer(compiler, {
  hot: true,
  //contentBase: './',
  quiet: false,
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: { colors: true }
})

server.use(hotMiddleware)

server.listen(port, function(err) {
  if (err) console.log(err)
  else console.log("Listening on http://localhost:" + port)
})
