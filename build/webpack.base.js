var path = require('path')
var webpack = require('webpack')
var root = path.resolve(__dirname, '../')

module.exports = {
  devtool: "eval",
  entry: {
    app: [path.join(__dirname, '../src/main.js')]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  resolve: {
    extensions: ['', '.js', '.css', 'vue']
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ["style", "css"]
      },
      {
        test: /\.vue$/,
        loaders: ['vue']
      },
      {
        test: /\.scss$/,
        vue: 'scss',
        loaders: ['css', 'sass']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ["es2015", "stage-2"],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.(png|jpg|gif|svg|woff2?|eot|ttf)$/,
        loader: "url",
        query: {
          limit: 10000,
          name: '[name]-[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  devServer: {
    headers: { "Access-Control-Allow-Origin": "*" }
  }
}
