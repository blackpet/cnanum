const path = require('path');

module.exports = (env, options) => {
  const config = {

    entry: {
      app: ['./src/app.js'],
      draggable: ['@babel/polyfill', './src/draggable.js'],
      'fa_ability.draggable': ['@babel/polyfill', './src/nongshim/fa_ability.draggable.js'],
      'bpf.poppy-1.1': ['@babel/polyfill', './src/bpf/bpf.poppy-1.1.js'],
      'bpf.video': ['@babel/polyfill', './src/bpf/bpf.video.js'],
    },

    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
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
        },

        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    },

    externals: {
      videojs: 'video.js'
    },
  };

  if (options.mode === 'development') {
    // TODO blackpet: development settings...

    config.devtool = 'inline-source-map';

    // webpack-dev-server settings
    config.devServer = {
      contentBase: path.join(__dirname),
      host: '0.0.0.0',
      port: 4000,
      hot: true,
      // open: true,
      proxy: {
        '/admin': {
          target: 'http://localhost:8080'
        }
      }
    }
  } else {
    // TODO blackpet: production settings...
  }

  return config;
};
