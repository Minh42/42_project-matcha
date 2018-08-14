const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    module: {
        rules: [
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader',
            ],
        },
        {
            test: /\.(png|jpe?g|gif)$/,
            use: [{
              loader: 'url-loader', //  return a DataURL if the file is smaller than byte limit
              options: {
                fallback: 'file-loader',
                limit: 10 * 1024,
              }
            }]
        }]
    },
    devServer: {
        hot: true
    }, 
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: "eval-source-map"
})

