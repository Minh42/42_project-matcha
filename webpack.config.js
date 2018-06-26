const webpack = require("webpack");
const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssets = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackShellPlugin = require('webpack-shell-plugin');
const devMode = process.env.NODE_ENV !== 'production'

let config = {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "/views"),
      filename: "bundle.js"
    },
    module: {
        rules: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ['react', 'stage-0', 'es2015'] // Transpiles JSX and ES6
          }
        },
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
              devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
              'sass-loader',
            ],
          }]
      },
      plugins: [
        new MiniCssExtractPlugin("styles.css"),
        new webpack.HotModuleReplacementPlugin({
          multiStep: true
        }),
        new WebpackShellPlugin({onBuildEnd: ['nodemon ./server.js']})
      ],
      devServer: {
        contentBase: path.resolve(__dirname, "./views"),
        historyApiFallback: true,
        inline: true,
        open: true,
        hot: true,
        host: 'localhost', // Defaults to `localhost`
        port: 3000, // Defaults to 8080
        watchContentBase: true,
        proxy: {
          '/api': 'http://localhost:8080'
        }
      },
      devtool: "eval-source-map"
  }

module.exports = config;

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin(),
        new OptimizeCSSAssets()
    );
}