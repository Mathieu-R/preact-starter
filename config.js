const path = require('path');
const production = process.env.NODE_ENV === "production";

module.exports = {
    title: '', // <title> of index.html
    port: {
        front: 3000, // port for devServer
        back: 8080 // port for backend api (proxytable)
    },
    //contentBase: path.resolve(__dirname, 'front'),
    entry: {
        front: [path.resolve(__dirname, 'front/js/main.js')], // entrypoint for front js file
        //back: [path.resolve(__dirname, 'back/server.js')] // entrypoint for server js file
    },
    vendor: ['preact'],
    devtool: production ? 'source-map' : 'eval-source-map',
    componentsPath: path.resolve(__dirname, 'front/js/components'), // path for components (aliases)
    staticPath: path.resolve(__dirname, 'front'), // path for static files (aliases)
    //template: './front/index.hbs' // path of template
}
