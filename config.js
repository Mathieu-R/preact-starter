const path = require('path');
const production = process.env.NODE_ENV === 'production';

module.exports = {
    port: {
        front: 3000, // port for devServer
        back: 8080 // port for backend api (proxytable)
    },
    entry: {
        front: [path.resolve(__dirname, 'src/index.js')], // entrypoint for front js file
        back: [path.resolve(__dirname, 'back/server.js')] // entrypoint for server js file
    },
    vendor: ['preact'],
    devtool: production ? false : 'eval-cheap-module-source-map',
    componentsPath: path.resolve(__dirname, 'src/components'), // path for components (aliases)
    staticPath: path.resolve(__dirname, 'src'), // path for static files (aliases)
    template: './src/index.html' // path of template
}
