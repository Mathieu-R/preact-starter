# Webpack 3 - boilerplate

This boilerplate for **webpack 3** is designed to work with _preact_.    
However, you can modify this boilerplate as you want _(e.g. to use it with Vue )_    

## Javascript :

All the javascript files _(.js, .jsx)_ are transpiled with babel and use sourcemaps for a better and easier debugging _(what you see in the devtools is the original file and not the transpiled one)_

In case you want more informations about **devtools** : https://webpack.js.org/configuration/devtool/

Feel free to use your owns in the _config.js_ file.

## Styles :

You can work with **.scss** files.  
_dev_ : css is automatically inlined in the **index.html**.   
_prod_ : css is extracted in its own **.css** file.

### Config :

```
module.exports = {
    title: '', // <title> of index.html
    port: {
        front: 3000, // port for devServer
        back: 8080 // port for backend api (proxytable)
    },
    entry: {
        front: [path.resolve(__dirname, 'front/static/js/components/app.js')], // entrypoint for front js file
    },
    vendor: ['preact'],
    devtool: production ? 'source-map' : 'eval-source-map',
    componentsPath: path.resolve(__dirname, 'front/static/js/components'), // path for components (aliases)
    staticPath: path.resolve(__dirname, 'front/static'), // path for static files (aliases)
}
```

### Plugins :

`ExtractTextPlugin` : Extract the css in its own file.    
`CommonsChunkPlugin` : Avoid duplication of common shared modules.

`DefinePlugin` : Allows to define global constants.    
`OccurenceOrderPlugin` : "Assign the module and chunk ids by occurrence count. Reduce total file size." (1)    
`UglifyJSPlugin` : Minify the js so it is lightweight

`HotModuleReplacementPlugin` : Update on the fly the modules that have changed and live reload it (if you authorize with `module.hot.accept()`).    
`NoEmitOnErrorPlugin` : Webpack does not compile assets with errors.     
`NamedModulePlugin` : Name the modules whith their own names in devtool instead of showing numbers.
`HtmlWebpackPlugin` : Generate an html files with js and css built-in.    
`BundleAnalyzerPlugin` : Show a graph to analyse to weight of every module / bundle.
`DashboardPlugin` : Show a dashboard in the terminal when you are using webpack-dev-server.

### Eslint and Editorconfig :

Eslint lints your code, to help you having a consistant code.    
Editorconfig keeps a consistant configuration between your text editor.

### Utilisation :


##### Installation :
- Note : you can also use `npm install` but yarn is advised (and also much faster).

```
yarn
```    

##### Dev :
Launch the `webpack-dev-server` and try to launch a `node server` from **back/server.js** in parallel.

```
yarn dev
```

> In case you don't want to launch a node server (no node backend in your app).
Launch the `webpack-dev-server` only.
```js
// config.js
module.exports = {
    ....
    entry: {
        ...
        back: false
    }
    ...
```

```
yarn watch
```

##### Build :      
Generate the `assets` _(css, js,...)_ in **dist** folder.

```
yarn build
```

(1) https://github.com/webpack/docs/wiki/list-of-plugins

##### TODO :
- Update dependencies
- Use `template`in html plugin
- Use babili instead of UglifyJS for optimizations
- minify CSS => `options: {minimize: true}`

