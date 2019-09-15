const merge = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./",
    historyApiFallback: true,
    port: 8080,
    proxy: {
      "/api": {
        target: "http://123.207.96.7:3000",
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
      },
    },
  },
})
