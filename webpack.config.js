const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "./main.js",
    chunkFilename: "[name].bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 3000,
    // watchContentBase: true,
    // progress: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    modules: ["node_modules", "src"],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
};
