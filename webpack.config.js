const config = require('./config.js');
const path = require('path');
const webpack = require('webpack');
const production = process.env.NODE_ENV === 'production';
const nodeExternals = require('webpack-node-externals');
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
    name: 'commons',
    filename: 'commons.js',
    minChunks: 2,
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
    chunks: true,
    hash: true,
    modules: false,
    publicPath: false,
    timings: true,
    version: false,
    warnings: true,
    colors: {
      green: '\u001b[32m'
    }
  }
}

if (production) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': production ? JSON.stringify('production') : JSON.stringify('development')
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
      title: config.title,
      filename: './index.html',
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
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.html', '.hbs', '.js', '.jsx', '.css', '.scss', '.vue', '.json', '.jpg', '.png', '.svg'],
    alias: {
      components: config.componentsPath,
      src: config.staticPath
    }
  },
  module: {
    rules: [{
      test: /\.hbs$/,
      loader: 'handlebars-loader'
    },{
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        // style-loader in developpment
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    },{
      test: /\.js|jsx$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },{
      test: /\.(ico|png|jpg|jpeg|gif|svg|woff2?|eot|ttf)$/,
      loader: "file-loader",
      query: {
        limit: 10000,
        name: '[name]-[hash:7].[ext]'
      }
    },{
      test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        name: '[name]-[hash:7].[ext]',
        limit: 10000,
      }
    }]
  },
  stats: {
    colors: {
      green: '\u001b[32m'
    }
  },
  performance: {
    hints: 'warning'
  },
  plugins,
  devServer
};

module.exports = common;
