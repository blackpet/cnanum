const path = require('path');

module.exports = (env, options) => {
  const config = {

    entry: {
      app: ['./src/app.js'],
      draggable: ['@babel/polyfill', './src/draggable.js']
    },

    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-arrow-functions']
            }
          }

        }
      ]
    }
  };

  if (options.mode === 'development') {
    // TODO blackpet: development settings...
    config.devServer = {
      host: '0.0.0.0',
      port: 4000
    }
  } else {
    // TODO blackpet: production settings...
  }

  return config;
};
