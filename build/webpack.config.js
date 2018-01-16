const config = require('./config.js');
const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const production = process.env.NODE_ENV === 'production';
const extractSass = new ExtractTextPlugin({
    filename: '[name].[contenthash].css'
});

const plugins = [
  extractSass,
  // extract common js code
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: function (module) {
      // any required modules inside node_modules are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(
          path.join(__dirname, '../node_modules')
        ) === 0
      )
    }
  }),
  // extract webpack bootstrap
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  }),
  // extract shared code from splitted chunks
  new webpack.optimize.CommonsChunkPlugin({
    name: 'async',
    async: 'vendor-async',
    children: true,
    minChunks: 3
  })
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
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MinifyPlugin({}, {
      comments: false
    }),
    // Compress extracted CSS.
    // Possible duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new htmlWebpackPlugin({
      template: config.template,
      minify: {
        removeComments: true
      },
      // make it work consistently with multiple chunks (CommonChunksPlugin)
      chunksSortMode: 'dependency'
    }),
    new ScriptExtHtmlWebpackPlugin({
      preload: ['manifest.bundle.*.js', 'async.bundle.*.js', 'common.bundle.*.js', 'app.bundle.*.js'],
      prefetch: {
        test: /\.js$/,
        chunks: 'async'
      }
    }),
    //new ResourceHintWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public/icons/'),
        to: path.resolve(__dirname, '../dist/public/icons/'),
        ignore: '.*'
      },
      {
        from: path.resolve(__dirname, '../public/images/'),
        to: path.resolve(__dirname, '../dist/public/images/'),
        ignore: '.*'
      },
      {
       from: path.resolve(__dirname, '../manifest.json'),
       to: path.resolve(__dirname, '../dist/manifest.json')
      }
    ]),
    new WorkboxPlugin({
      "globDirectory": "dist/",
      "globPatterns": [
        "**/*.{js,css,html,json,jpg,png,svg,webp}"
      ],
      "swDest": "dist/sw.js",
      clientsClaim: true,
      skipWaiting: true,
      "runtimeCaching": []
    }),
    new ProgressBarPlugin()
  );
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(), // hot reload
    new webpack.NoEmitOnErrorsPlugin(), // do not build bundle if they have errors
    new webpack.NamedModulesPlugin(), // print more readable module names in console on HMR,
    new htmlWebpackPlugin({ // generate index.html
      template: config.template,
    }),
    new FriendlyErrorsPlugin()
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
    filename: production ? '[name].bundle.[hash].js' : [name].bundle.js,
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
    hints: production ? 'warning' : false
  },
  plugins,
  devServer
};

module.exports = common;
