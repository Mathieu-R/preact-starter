require('shelljs/global')
var webpack = require("webpack")
var conf = require('./webpack.prod.js')
var ora = require('ora')
var spinner = ora('building...')

spinner.start()
rm('-rf', 'dist')

webpack(conf, function(err, stats) {
  spinner.stop()
  if (err) throw err

  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
