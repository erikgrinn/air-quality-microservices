// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const webpack = require('webpack'); // ZEROMQ

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  // resolve: { // ZEROMQ
  //   fallback: {
  //       "fs": false, // Ignore the `fs` module
  //       "path": require.resolve("path-browserify") // Optionally add path-browserify for compatibility
  //   }
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
    // new webpack.IgnorePlugin({ // ZEROMQ
    //   resourceRegExp: /zeromq|load-addon\.js/,
    // }),
  ],
  module: {
    // noParse: /zeromq|load-addon\.js/, // ZEROMQ Ignore parsing for ZeroMQ
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.csv$/,
        use: 'csv-loader'
      },
    ],
  },
};