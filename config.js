const path = require('path');
const production = process.env.NODE_ENV === 'production';

module.exports = {
    port: {
        front: 8080, // port for devServer
    },
    entry: {
        front: [path.resolve(__dirname, 'src/index.js')], // entrypoint for front js file
    },
    devtool: production ? false : 'eval-cheap-module-source-map',
    componentsPath: path.resolve(__dirname, 'src/components'), // path for components (aliases)
    routesPath: path.resolve(__dirname, 'src/routes'),
    staticPath: path.resolve(__dirname, 'src'), // path for static files (aliases)
    template: './src/index.html' // path of template
}
