const withSass = require('@zeit/next-sass');
const withOffline = require('next-offline');
const webpack = require('webpack');
require('dotenv').config();

module.exports = withSass(withOffline({
  webpack: (config) => {
  // Fixes npm packages that depend on `fs` module
  // config.node = {
  //   fs: 'empty'
  // }

    // config.optimization.minimize = false;

    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});

    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
}));
