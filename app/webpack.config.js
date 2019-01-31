const fs = require('fs')
const nodeExternals = require('webpack-node-externals')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path')

const root = path.resolve(__dirname, '..')
const pkg = require('../package.json')

const { rules, plugins, loaders } = require('webpack-atoms')

const parserAliases = {}
fs.readdirSync(root + '/parsers')
  .filter(p => fs.statSync(`${root}/parsers/${p}`).isDirectory())
  .forEach(dir => {
    parserAliases[`@astonish/${dir}`] = `${root}/parsers/${dir}/src`
  })

const devServer = {
  port: 8000,
  contentBase: path.join(__dirname, './build'),
  historyApiFallback: {
    index: '/',
  },
  stats: 'minimal',
}

module.exports = (_, { mode }) => {
  // prod uses file:// so we need relative paths
  const publicPath = mode === 'production' ? './' : '/'

  return {
    mode,
    devtool: 'module-source-map',
    entry: {
      app: './index.js',
    },

    output: {
      publicPath,
      path: path.resolve('./build'),
      filename: '[name].js',
      libraryTarget: 'var',
    },

    target: 'electron-renderer',

    module: {
      rules: [
        { ...rules.js({ envName: mode }), test: /\.(j|t)sx?$/ },
        {
          test: /\.(j|t)sx?$/,
          use: [loaders.cssLiteral({ extension: '.module.scss' })],
        },
        rules.fastSass(),
        rules.css(),
        rules.images(),
        rules.fonts(),
      ],
    },

    externals: [
      nodeExternals({
        modulesDir: 'app/node_modules',
        whitelist: [
          /^webpack/,
          // assets, styles, etc
          /\.(?!(?:jsx?|json)$).{1,5}$/i,
        ],
      }),
    ],
    resolve: {
      alias: parserAliases,
      extensions: ['.mjs', '.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
      new MonacoWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        async: false,
        tslint: false,
        compilerOptions: {
          noUnusedLocals: false,
          noUnusedParameters: false,
          baseUrl: '../',
          paths: pkg['workspace-sources'],
        },
      }),
      plugins.html({
        template: path.resolve(__dirname, './assets/index.html'),
        // For some reason all paths are lost when using HtmlWebpackPlugin and
        // the dev server so require() can't find anything. We pass it here
        // and monkey-patch `module` in the index.html
        appModules:
          mode !== 'production'
            ? path.resolve(__dirname, 'app/node_modules')
            : false,
      }),
    ],
    stats: 'minimal',
    devServer,
  }
}

module.exports.devServer = devServer
