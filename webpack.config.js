const config = require('./config.js');
const path = require('path');
const webpack = require('webpack');
const production = process.env.NODE_ENV === 'production';
const htmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
    filename: '[name].[contenthash].css',
    disable: !production
});

const plugins = [
  extractSass,
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common'
  }),
  new webpack.optimize.ModuleConcatenationPlugin()
];

const devServer = {
  contentBase: config.contentBase,
  hot: true,
  hotOnly: true,
  historyApiFallback: true,
  port: config.port.front,
  compress: production,
  inline: !production,
  hot: !production,
  stats: {
    assets: true,
    children: false,
    chunks: false,
    hash: true,
    modules: false,
    publicPath: false,
    timings: true,
    version: false,
    warnings: true
  }
}

if (production) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      comments: false,
      compress: {
        unused: true,
        warnings: false,
        conditionals: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    })
  );
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(), // hot reload
    new webpack.NoEmitOnErrorsPlugin(), // do not build bundle if they have errors
    new webpack.NamedModulesPlugin(), // print more readable module names in console on HMR,
    new htmlWebpackPlugin({ // generate index.html
      template: config.template,
    })
    //new BundleAnalyzerPlugin(), // analyse the bundles and their contents
    //new DashboardPlugin({port: 8085})
  );
};

if (config.entry.back) {
  Object.assign(devServer, {proxy: {
    "*": `http://localhost:${config.port.back}`
  }});
}


const common = {
  devtool: config.devtool,
  entry: {
    app: config.entry.front,
    vendor: config.vendor
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.[hash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
    alias: {
      components: config.componentsPath,
      src: config.staticPath
    }
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        // style-loader in developpment
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    },{
      test: /\.js|jsx$/,
      exclude: /node_modules/,
      include: path.resolve(__dirname, "src"),
      loader: 'babel-loader'
    },{
      test: /\.(ico|png|jpg|jpeg|gif|svg|woff2?|eot|ttf)$/,
      loader: "file-loader",
      query: {
        limit: 10000,
        name: '[name]-[hash:7].[ext]'
      }
    }]
  },
  performance: {
    hints: 'warning'
  },
  plugins,
  devServer
};

module.exports = common;
