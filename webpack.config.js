module.exports = {
  entry: "./src/app.ts",
  output: {
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
