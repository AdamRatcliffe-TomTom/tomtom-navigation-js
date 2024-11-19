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
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    fallback: {
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      crypto: require.resolve("crypto-browserify"),
      process: require.resolve("process"),
      os: require.resolve("os-browserify"),
      path: require.resolve("path-browserify"),
      constants: require.resolve("constants-browserify"),
      vm: require.resolve("vm-browserify"),
      fs: false // Disable fs module
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"] // Resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/, // Transpile JavaScript and JSX
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
