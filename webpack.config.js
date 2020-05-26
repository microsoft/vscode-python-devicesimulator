const path = require("path");
const tsImportPlugin = require("ts-import-plugin");

module.exports = {
  entry: {
    simulator: "./src/view/index.tsx"
  },
  output: {
    path: path.resolve(__dirname, "out"),
    filename: "[name].js"
  },
  devServer: {
    historyApiFallback: true
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: {
          getCustomTransformers: () => ({
            before: [
              tsImportPlugin({
                libraryName: "antd",
                libraryDirectory: "es",
                style: true
              })
            ]
          })
        }
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
              sourceMap: true,
              modifyVars: {
                "@body-background": "var(--background-color)"
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.svg$/,
        loader: "svg-inline"
      }
    ]
  }
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //   react: "React",
  //   "react-dom": "ReactDOM"
  // }
};
