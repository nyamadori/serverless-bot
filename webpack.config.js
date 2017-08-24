const path = require('path')
const { CheckerPlugin } = require('awesome-typescript-loader')

const commonConfig = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ],
    noParse: [/\/ws\//]
  },

  externals: ['ws'],

  plugins: [
    new CheckerPlugin()
  ]
}

const serverConfig = Object.assign(commonConfig, {
  target: 'node',
  entry: './src/app/index.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
    libraryTarget: 'commonjs'
  },

  devtool: 'inline-source-map',
})

module.exports = [serverConfig]
