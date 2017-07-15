var path                = require( 'path' );
var webpack             = require( 'webpack' );
var merge               = require( 'webpack-merge' );
var HtmlWebpackPlugin   = require( 'html-webpack-plugin' );
var autoprefixer        = require( 'autoprefixer' );
var ExtractTextPlugin   = require( 'extract-text-webpack-plugin' );
var CopyWebpackPlugin   = require( 'copy-webpack-plugin' );


const prod = 'production';
const dev = 'development';

// determine build env
const TARGET_ENV = process.env.npm_lifecycle_event === 'build' ? prod : dev;

console.log('WEBPACK GO! Building for ' + TARGET_ENV);

// common webpack config (valid for dev and prod)
var commonConfig = {

  output: {
    path:     path.resolve( __dirname, 'dist/' ),
    filename: '[hash].js',
  },

  resolve: {
    modules:            ['node_modules'],
    extensions:         ['.js', '.elm']
  },

  module: {
    noParse: /\.elm$/,
    rules: [{
      test: /\.js$/,
      exclude: ['/src/styles/', /node_modules/],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }
    },
    {
      test: /\.(png|jpg|gif|eot|ttf|woff|woff2|svg)$/,
      use: {
        loader: 'file-loader'
      }
    }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject:   'body',
      filename: 'index.html'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer({browsers: ['last 2 versions']})
        ],
        eslint: {
          failOnWarning: true,
          failOnError: true
        }
      }
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
      inline:   true,
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
        },
        {
          test: /\.(css|less)$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'less-loader'
          ]
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
        },
        {
          test: /\.(css|less)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader', 'less-loader']
          })
        }
      ]
    },

    plugins: [
      // extract CSS into a separate file
      new ExtractTextPlugin({
        filename: './[hash].css',
        allChunks: true
      }),

      new CopyWebpackPlugin([
        {
          from: 'src/images/',
          to:   'images/'
        },
        {
          from: 'src/papers/',
          to:   'papers/'
        },
        {
          from: 'src/favicon.ico'
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
