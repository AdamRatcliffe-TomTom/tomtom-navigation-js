const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js", // Entry point for your library
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    globalObject: "this",
    library: {
      name: "tomtom-navigation",
      type: "umd"
    }
  },
  externals: {
    react: "react",
    "react-dom": "react-dom"
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|cjs|jsx|ts|tsx)$/, // Transpile JavaScript and JSX
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "@types", to: "dist/@types" }]
    })
  ],
  mode: "production" // Minify and optimize the output
};
