module.exports = {
  entry:  './src',
  output: {
    path:     'builds',
    filename: 'bundle.js',
    publicPath: 'http://192.168.178.14:8000/builds',
  },
  module: {
    loaders: [
      {
        test:   /\.js/,
        loader: 'babel',
        include: __dirname + '/src',
      }
    ],
  },
  devServer: {
    port: 8000,
    host: '0.0.0.0'
  }
};

