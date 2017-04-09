const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const phaserModulePath = path.join(__dirname, '/node_modules/phaser-ce/');
const phaserPath = path.join(phaserModulePath, 'build/custom/phaser-split.js');
const pixiPath = path.join(phaserModulePath, 'build/custom/pixi.js');
const p2Path = path.join(phaserModulePath, 'build/custom/p2.js');

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
});

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.js')
    ],
    vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'app.bundle.js'
  },
  plugins: [
    definePlugin,
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: 'app.vendor.bundle.js'/* filename= */}),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./public']
      }
    })
  ],
  module: {
    rules: [
      {test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src')},
      {test: /pixi\.js/, use: ['expose-loader?PIXI']},
      {test: /phaser-split\.js$/, use: ['expose-loader?Phaser']},
      {test: /p2\.js/, use: ['expose-loader?p2']}
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      'phaser': phaserPath,
      'pixi': pixiPath,
      'p2': p2Path
    }
  },
  devtool: 'cheap-source-map',
  watch: true
};
