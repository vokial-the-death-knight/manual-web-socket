const path = require("path");

module.exports = {
  entry: "./src/app.ts",
  //devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "tmp"),
    filename: "manual-web-socket.js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  }
};
