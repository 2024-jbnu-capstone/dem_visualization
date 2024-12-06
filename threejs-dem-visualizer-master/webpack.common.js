const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")

module.exports = {
  target: "web",
  context: __dirname,
  entry: {
    visual: ["/src/js/visual.js", "/src/sass/visual.sass"],
    index:["./src/js/index.js", "/src/sass/index.sass"],
    jeonghop: ["/src/js/jeonghop.js", "/src/sass/jeonghop.sass"],
    pro:["/src/js/pro.js", "/src/sass/pro.sass"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[chunkhash].js",
    chunkFilename: "[id].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, "js", "src")],
        exclude: [path.resolve(__dirname, "node_modules")],
        use: {
          loader: "esbuild-loader",
        }
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              //   modules: true,
              // importLoaders allows to configure how many loaders before css-loader should be applied to @imported resources.
              // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
              importLoaders: 2,
            }
          },
          {
            loader: "sass-loader",
          }
        ]
      },
      // rule for textures (images)
      {
        test: /\.(jpe?g|png|tif)$/i,
        include: path.resolve(__dirname, "src", "textures"),
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              disable: true, // webpack@2.x and newer
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                optimizationLevel: 7,
              },
              gifsicle: {
                interlaced: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
            }
          }
        ]
      }
    ]
  },
  devServer: {
    host: "localhost",
    port: 8080,
    open: true,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },

  plugins: [
    // new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin({
      root: __dirname,
      exclude: ["favicon.ico"],
      verbose: true
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "templates", "visual.html"),
      hash: true,
      filename: "visual.html",
      chunks: ["commons", "visual"]
    }),
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname, "src", "templates", "index.html"),
      filename: "index.html",
      chunks:["commons", "index"]
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "templates", "jeonghop.html"),
      filename: "jeonghop.html",
      chunks:["common", "jeonghop"]
    }),
    
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname, "src", "templates", "pro.html"),
      filename: "pro.html",
      chunks:["commons", "pro"]
    }),
  ],

  externals: {
    GeoTIFF: 'GeoTIFF',
  },
};
