const path=require("path");
const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const common = require('./webpack.common.js');
const NodemonPlugin=require('nodemon-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map', // TODO add multiple webpack conf
  performance: {
    hints: "warning"
  },
  devServer:{
    host: 'localhost',
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' }, // 루트 경로는 index.html로 매핑
      { from: /^\/visualization/, to: '/visual.html' }, // /visualization 경로는 visual.html로 매핑
      { from: /^\/jeonghop/, to: '/jeonghop.html' }, // /jeonghop 경로는 jeonghop.html로 매핑
      { from: /^\/report/, to: '/pro.html' },
      ],
    },
    proxy:{
      "/api":"http://localhost:8080",
    },
    client:{
      overlay:{
        errors:true,
        warnings: false,
      },
    },
  },
  
  plugins: [
    new ESLintPlugin(),
    new NodemonPlugin({
      script: path.resolve(__dirname, 'app.js'),
      watch: path.resolve(__dirname, 'app.js'),
      ignore:['*.js.map'],
    }),
  ],
});


