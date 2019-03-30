var path = require('path');
var webpack = require('webpack');
module.exports = {
 entry: ["@babel/polyfill",'./client/index.js'],
 output: {
  path: path.join(__dirname, 'client'),
  filename: 'bundle.js',
  publicPath: '/'
 },
 module: {
  rules: [{
   test: /.jsx?$/,
   loader: 'babel-loader',
   exclude: /node_modules/,
   query: {
    presets: ["@babel/preset-env","@babel/preset-react"]
   }
  },
  {
   test: /\.css$/,
   loader: "style-loader!css-loader"
  },
  {
    test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
    loader: 'url-loader?limit=100000'
  }]
 },
 devServer: {
  historyApiFallback: true,
  contentBase: './',
  hot: true
 }
}