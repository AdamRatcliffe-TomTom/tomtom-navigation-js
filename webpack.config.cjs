const path = require("path");
const peerDependencies = require("./package.json").peerDependencies;

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
  externals: Object.keys(peerDependencies).reduce((externals, pkg) => {
    externals[pkg] = pkg; // Treat each peer dependency as an external
    return externals;
  }, {}),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transpile JavaScript and JSX
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".js", ".jsx"] // Resolve these extensions
  },
  mode: "production" // Minify and optimize the output
};
