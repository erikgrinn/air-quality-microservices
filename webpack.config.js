// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: { //for zeromq
    fallback: {
      "path": require.resolve("path-browserify"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/files', to: 'files' }, // Copy from src/files to dist/files
      ],
    }),
  ],
  module: {
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
      // {
      //   test: /\.csv$/,
      //   use: [
      //     {
      //         loader: 'csv-loader',
      //         options: {
      //             dynamicTyping: true,
      //             header: true,
      //             skipEmptyLines: true
      //         }
      //     }
      //   ]
      // },
    ],
  },
};