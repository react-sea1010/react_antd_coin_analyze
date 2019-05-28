const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/bower_components/, /node_modules/, /styles/],
      },
      {
        test: /\.css$/,
        include: [path.resolve('src')],
        loaders: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.less$/,
        loader: ['less-loader']// compiles Less to CSS
      },{
        test: /\.(png|jp(e*)g|svg|gif)$/,  
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8000, // Convert images < 8kb to base64 strings
            name: 'images/[hash]-[name].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    })
  ],  
  devServer: {
    historyApiFallback: true
  },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: 'https://backend.dtra.io'
    })
  }
}
