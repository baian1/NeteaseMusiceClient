const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const ManifestPlugin = require("webpack-manifest-plugin")
const DashboardPlugin = require("webpack-dashboard/plugin")
const webpack = require("webpack")

module.exports = {
  entry: {
    main: "./src/index.tsx",
  },
  output: {
    filename: "[name].[chunkhash].bundle.js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.join(__dirname, "/dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      },
      {
        test: /\.tsx?$/,
        loader: ["ts-loader"],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
      {
        test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      chunksSortMode: "none",
    }),
    new ManifestPlugin(),
    new DashboardPlugin(),
    new webpack.HashedModuleIdsPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      // minChunks: 2
    },
    runtimeChunk: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
}
