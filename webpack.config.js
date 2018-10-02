const path                  = require('path');
const webpack               = require('webpack');
const merge                 = require('webpack-merge');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const CleanWebpackPlugin    = require("clean-webpack-plugin");
const CopyWebpackPlugin     = require('copy-webpack-plugin');


const prod = 'production';
const dev = 'development';

// determine build env
const TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? prod : dev;

console.log('WEBPACK GO! Building for ' + TARGET_ENV);


// used to extract CSS into a separate file (instead of
// embedding inside JS)
const extractCss = new ExtractTextPlugin({
  filename: "[contenthash].css",
  allChunks: true,
  disable: TARGET_ENV === dev
});


// common webpack config (valid for dev and prod)
var commonConfig = {

  entry: {
    index: path.join( __dirname, 'src/index.js' ),
    presentation: path.join( __dirname, 'src/presentation.js' ),
  },

  output: {
    path:       path.resolve(__dirname, 'dist/'),
    publicPath: '/',
    filename:   '[name].js',
  },

  resolve: {
    modules:    ['node_modules'],
    extensions: ['.js', '.elm']
  },

  module: {
    noParse: /\.elm$/,

    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: true,
              failOnError: true
            }
          }
        ]
      },
      // Don't bundle reveal.js files; css is handled in the next rule to
      // process dependencies
      {
        test: /\.(html|js|eot|ttf|woff|woff2)$/,
        include: [/reveal\.js/],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: path.join( __dirname, 'node_modules' ),
            }
          }
        ]
      },
      // Don't bundle reveal.js CSS files; keep them as separate files.
      {
        test: /\.css$/,
        include: [
            /reveal\.js[\/\\]css/,
            /reveal\.js[\/\\]css[\/\\]theme/,
            /reveal\.js[\/\\]css[\/\\]print/,
            /reveal\.js[\/\\]lib[\/\\]css/,
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: path.join( __dirname, 'node_modules' ),
            }
          }
        ]
      },
      {
        test: /\.(css|less)$/,
        include: [
            // extend this list as necessary
            /src/,
        ],
        exclude: [
        ],
        use: extractCss.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            'less-loader'
          ]
        }),
      },
      // for semantic-ui-less files:
      {
        test: /\.less$/,
        include: [/semantic-ui-less/],
        use: extractCss.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            {
              loader: 'semantic-ui-less-module-loader',
              options: {
                themeConfigPath: path.join(__dirname, 'src/styles/theme.config'),
                siteFolder: path.join(__dirname, 'src/styles/site')
              }
            }
          ]
        }),
      },
      {
        test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
        include: [
            /src/,
            /semantic-ui-less/
        ],
        use: {
          loader: 'file-loader'
        }
      }
    ]
  },

  plugins: [
    extractCss,

    new FaviconsWebpackPlugin('./src/favicon.png'),

    new HtmlWebpackPlugin({
      // using .ejs for template so HTML loaders don't pick it up
      filename: 'index.html',
      template: 'src/index.ejs',
      inject:   'body',
      chunks: ['index'],
    }),

    new HtmlWebpackPlugin({
      filename: 'presentations/unicode.html',
      template: 'src/presentations/unicode.html',
      chunks: ['presentation'],
    }),

    new HtmlWebpackPlugin({
      filename: 'presentations/sherrloc.html',
      template: 'src/presentations/sherrloc.html',
      chunks: ['presentation'],
    }),

    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
}

// additional webpack settings for local env (when invoked by 'npm start')
if ( TARGET_ENV === dev ) {
  console.log( 'Serving locally...');

  module.exports = merge( commonConfig, {

    entry: {
      dev: 'webpack-dev-server/client?http://localhost:8080',
    },

    devServer: {
      inline: true,
      hot: true,
      historyApiFallback: true
    },

    module: {
      rules: [
        {
          test:    /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          use: [{
            loader: 'elm-webpack-loader',
            options: {
              verbose: true,
              warn: true,
              debug: true
            }
          }]
        }
      ]
    }

  });
}

// additional webpack settings for prod env (when invoked via 'npm run build')
if ( TARGET_ENV === prod ) {
  console.log( 'Building for prod...');

  module.exports = merge( commonConfig, {

    module: {
      rules: [
        {
          test:    /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          use:  'elm-webpack-loader'
        }
      ]
    },

    plugins: [
      new CleanWebpackPlugin(
        ["dist"],
        {
          root: __dirname
        }
      ),
      new CopyWebpackPlugin([
        {
          from: 'src/images/',
          to:   'images/'
        },
        {
          from: 'src/papers/',
          to:   'papers/'
        }
      ]),

      // minify & mangle JS/CSS
      new webpack.optimize.UglifyJsPlugin({
          minimize:   true,
          compressor: { warnings: false }
          // mangle:  true
      })
    ]

  });
}
