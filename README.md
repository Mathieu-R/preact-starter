# Webpack 4 - Preact

This boilerplate for **webpack 4** is designed to work with _preact_.    
However, you can modify this boilerplate as you want _(e.g. to use it with Vue )_    

## Javascript :

All the **javascript** files are transpiled with babel and use sourcemaps (in developpment) for a better and easier debugging _(what you see in the devtools is the original file and not the transpiled one)_

In case you want more informations about **devtools** : https://webpack.js.org/configuration/devtool/

Feel free to use your owns in the _config.js_ file.

## Styles :

You can work with **.scss** files.  
_dev_ : css is automatically inlined in the **index.html**.   
_prod_ : css is extracted in its own **.css** file.

### Config :

```
module.exports = {
    port: {
        front: 3000, // port for devServer
    },
    entry: {
        front: [path.resolve(__dirname, 'front/static/js/components/app.js')], // entrypoint for front js file
    },
    devtool: production ? false : 'eval-cheap-module-source-map',
    componentsPath: path.resolve(__dirname, 'src/components'), // path for components (aliases)
    routesPath: path.resolve(__dirname, 'src/routes'),
    staticPath: path.resolve(__dirname, 'src'), // path for static files (aliases)
    template: './src/index.html' // path of template
}
```

### Plugins :

`ExtractTextPlugin` : Extract the css in its own file.    

`HotModuleReplacementPlugin` : Update on the fly the modules that have changed and live reload it (if you authorize with `module.hot.accept()`).    

`HtmlWebpackPlugin` : Generate an html files with js and css built-in.    

### Eslint and Editorconfig :

Eslint lints your code, to help you having a consistant code.    
Editorconfig keeps a consistant configuration between your text editor.

### Usage :

##### Installation :
- Note : you can also use `npm install`.

```
yarn
```    

##### Dev :
Launch the `webpack-dev-server`

```
yarn start
```

##### Build :      
Generate the `assets` _(css, js,...)_ in **dist** folder.

```
yarn build
```

(1) https://github.com/webpack/docs/wiki/list-of-plugins

### Caveat : 
- By default, only js files in `src` are transpiled as recommended by https://webpack.js.org/guides/build-performance/

### TODO
[ ] autoprefixer with postcss

