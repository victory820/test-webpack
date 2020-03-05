const autoprefixer = require('autoprefixer')
const path = require('path')
const glob = require('glob')
const HtmlWebapckPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const FriendlyErrorsWebapckPlugin = require('friendly-errors-webpack-plugin')

// 这里更改路径，因为冒烟测试时路径匹配不上
const projectRoot = process.cwd()

const setMPA = () => {
  const entry = {}
  const htmlWebapckPlugins = []
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'))
  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index]
      const match = entryFile.match(/src\/(.*)\/index\.js/)
      const pageName = match && match[1]
      entry[pageName] = entryFile
      return htmlWebapckPlugins.push(
        new HtmlWebapckPlugin({
          template: path.join(projectRoot, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: `${pageName}`,
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minnifyCSS: true,
            minifyJS: true,
            removeComments: false,
          }
        })
      )
    })

  return {
    entry,
    htmlWebapckPlugins,
  }
}

const { entry, htmlWebapckPlugins } = setMPA()


module.exports = {
  entry,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: ['last 2 version', '>1%', 'ios 7'],
                }),
              ],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebapckPlugin(),
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length
          && process.argv.indexOf('---watch') === -1) {
          console.log('build error') // eslint-disable-line
          process.exit(1)
        }
      })
    }
  ].concat(htmlWebapckPlugins),
  stats: 'errors-only'
}
