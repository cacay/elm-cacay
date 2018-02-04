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

  output: {
    path:     path.resolve(__dirname, 'dist/'),
    filename: '[hash].js',
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
        exclude: ['/src/styles/', /node_modules/],
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
      {
        test: /\.(css|less)$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            'less-loader'
          ]
        }),
        // Exclude Semantic UI; these are handled by semantic-ui-less-module-loader
        exclude: [/[\/\\]node_modules[\/\\]semantic-ui-less[\/\\]/]
      },
      // for semantic-ui-less files:
      {
        test: /\.less$/,
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
        include: [/[\/\\]node_modules[\/\\]semantic-ui-less[\/\\]/]
      },
      {
        test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
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
      template: 'src/index.ejs',
      inject:   'body',
      filename: 'index.html'
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

    entry: [
      'webpack-dev-server/client?http://localhost:8080',
      path.join( __dirname, 'src/index.js' )
    ],

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

    entry: path.join( __dirname, 'src/index.js' ),

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
