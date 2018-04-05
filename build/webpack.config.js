const config = require('../config.js');
const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const production = process.env.NODE_ENV === 'production';
const extractSass = new ExtractTextPlugin({
    filename: '[name].[md5:contenthash:hex:20].css'
});

const sw = path.join(__dirname, '../src/sw.js');

const plugins = [
  extractSass
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
    new webpack.optimize.OccurrenceOrderPlugin(),
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
      preload: ['runtime~app.bundle.*.js', 'vendor~app.bundle.*.js', 'app.bundle.*.js'],
      prefetch: {
        test: /\.js$/,
        chunks: 'async'
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/assets/'),
        to: path.resolve(__dirname, '../dist/assets/')
      },
      {
       from: path.resolve(__dirname, '../src/manifest.json'),
       to: path.resolve(__dirname, '../dist/manifest.json')
      }
    ]),
    new InjectManifest({
      swSrc: sw,
      globPatterns: [
        '**/*.{js,css,html,json,jpg,png,svg,webp}'
      ]
    })
  );
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(), // hot reload
    new htmlWebpackPlugin({ // generate index.html
      template: config.template,
    }),
    new FriendlyErrorsPlugin()
  );
};

const common = {
  devtool: config.devtool,
  // webpack 4 - optimization auto
  mode: production ? 'production' : 'development',
  // do not continue build if any errors
  bail: true,
  entry: {
    app: config.entry.front
  },
  output: {
    path: path.resolve('dist'),
    filename: production ? '[name].bundle.[hash].js' : '[name].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
    alias: {
      // in order to use css-transition-group
      // you have to aliase react and react-dom
      react: 'preact-compat',
			'react-dom': 'preact-compat',
			'react-addons-css-transition-group': 'preact-css-transition-group',
      components: config.componentsPath,
      routes: config.routesPath,
      src: config.staticPath
    }
  },
  module: {
    rules: [{
      test: /\.(css|scss)$/,
      use: ExtractTextPlugin.extract({
        // style-loader in developpment
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
    },{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      include: path.resolve(__dirname, "../src"),
      loader: 'babel-loader'
    },{
      test: /\.(png|svg)$/,
      loader: production ? 'file-loader' : 'url-loader',
      query: {
        limit: 10000,
        name: '[name]-[hash:7].[ext]'
      }
    }]
  },
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all'
    }
  },
  performance: {
    hints: production ? 'warning' : false
  },
  plugins,
  devServer
};

module.exports = common;
