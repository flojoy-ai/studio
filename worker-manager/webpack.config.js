const path = require('path');

module.exports = {
  entry: './worker-manager.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname),
    filename: 'worker-manager-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};





