const path = require("path");
const { peerDependencies } = require("./package.json");

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
  mode: "production" // Minify and optimize the output
};
