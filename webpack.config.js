var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        path: path.join(__dirname, './es5'),
        filename: 'index.js',
        libraryTarget: 'commonjs'
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            test: /\.js$/                                            
        }]
    }
};