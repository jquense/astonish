const nodeExternals = require('webpack-node-externals')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const path = require('path')

const { rules, plugins, loaders } = require('webpack-atoms')

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
    entry: {
      app: './app',
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
        rules.js({ envName: mode }),
        {
          test: /\.js/,
          use: [loaders.cssLiteral({ extension: '.module.scss' })],
        },
        { oneOf: [rules.fastSass.modules(), rules.fastSass()] },
        { oneOf: [rules.css.modules(), rules.css()] },
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
      modules: ['node_modules', 'shared'],
    },
    plugins: [
      new MonacoWebpackPlugin(),
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
