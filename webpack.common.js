const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin'); // clear out our /dist directory before each build
const HtmlWebpackPlugin = require('html-webpack-plugin'); // create an html file to serve webpack bundle
const WebpackShellPlugin = require('webpack-shell-plugin'); // run nodemon in parallel

let config = {
    entry: "./src/index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist") // create a bubdle.js file in dist directory
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: "babel-loader", // run preprocessors to transpile ES6 down to ES5 that runs in all browsers
              options: {
                cacheDirectory: true, // cache the results of the loader to avoid running recompilation process 
                presets: ['env', 'react', 'stage-3', 'stage-0'] 
              }
            }
          }
        ]
      },
      plugins: [
        new CleanWebpackPlugin('dist', {} ),
        new HtmlWebpackPlugin({
          template: __dirname + '/views/index.html',
          filename: 'index.html',
          title: 'Matcha'
        }),
        new WebpackShellPlugin({onBuildEnd: ['nodemon --watch src server.js']}),
      ],
      devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
        historyApiFallback: true,
        inline: true,
        open: true,
        host: 'localhost', // Defaults to `localhost`
        port: 3000, // Defaults to 8080
        watchContentBase: true,
        proxy: {
          '/api': {
            target: 'http://localhost:8080'
          }
        }
      }
  }

module.exports = config;