const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const LicenseCheckerWebpackPlugin = require('license-checker-webpack-plugin');

const srcDir = path.resolve(__dirname, 'src');
const libDir = path.resolve(__dirname, 'lib');

module.exports = {
  context: srcDir,
  entry: './index.mjs',
  output: {
    path: libDir,
    filename: 'reqperformer.js',
    library: 'ReqPerformer',
    libraryTarget: 'umd'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules/'),
      path.resolve(__dirname, 'src/'),
      path.resolve(__dirname, './')
    ],
    extensions: ['.js', '.mjs']
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new LicenseCheckerWebpackPlugin({
      allow: '(Apache-2.0 OR BSD-2-Clause OR BSD-3-Clause OR MIT)',
      outputFilename: 'ThirdPartyNotices.txt'
    })
  ],
  performance: {
    maxEntrypointSize: 5120,
    maxAssetSize: 5120,
    hints: 'warning'
  }
};
