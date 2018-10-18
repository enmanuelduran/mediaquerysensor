const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/MediaQuerySensor.js',
    mode: 'none',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'mediaquerysensor.min.js',
        libraryTarget: 'umd',
        library: 'MQS',
        libraryExport: 'default'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: 'babel-loader'
            }
        ]
    },
    optimization: {
        minimize: true
    }
};
