const path = require('path');

module.exports = (env, options) => {
  const config = {

    entry: {
      app: ['./src/app.js'],
    },

    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
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
