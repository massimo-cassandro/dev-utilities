/* eslint-env node */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const {BannerPlugin} = require('webpack');
const PACKAGE = require('./package.json');
const path = require('path');



// const Dotenv = require('dotenv-webpack');
const isDevelopment = false, // process.env.NODE_ENV === 'development';
  buildSourcemaps = true, //isDevelopment;

  buildPath = path.resolve(__dirname, '../xxx/build'),
  publicPath = '/build';

const config = {
  mode: isDevelopment? 'development' : 'production',

  watch: true,

  // Control how source maps are generated
  // devtool: isDevelopment? 'inline-source-map' : 'source-map', // false, <== false non aggiunge la sourcemap ,
  devtool: 'source-map',

  // Where webpack looks to start building the bundle
  entry: {
    __entry_name__: './path/to/entry.js',
  },
  // Where webpack outputs the assets and bundles

  output: {
    clean: true,
    path: buildPath,
    // filename: '[name].js',
    filename: '[name].[contenthash].js',
    publicPath: publicPath,
  },


  optimization: {
    minimize: !isDevelopment,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        // terserOptions: {
        //   format: {
        //     comments: false,
        //   },
        // },
        extractComments: false,
      }),
    ],
    runtimeChunk: 'single',
    // splitChunks: {
    //   chunks: 'all',
    // },
    // runtimeChunk: {
    //   name: 'runtime',
    // },
    usedExports: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  // Spin up a server for quick development
  // devServer: {
  //   historyApiFallback: {
  //     index: '/',
  //     // rewrites: [
  //     //   { from: /^\/dashboard-carousel-json$/, to: '/dashboard-carousel-json.json' }
  //     // ],
  //   },
  //   static: {
  //     directory: paths.dev,
  //     serveIndex: true
  //   },
  //   open: true,
  //   compress: true,
  //   hot: true,
  //   // host: '0.0.0.0',
  //   port: 5507
  // },
  // Customize the webpack build process

  plugins: [

    // new Dotenv({
    //   path: isDevelopment? './.env.development' : './.env',
    //   expand: true,
    //   ignoreStub: true
    // }),

    // Removes/cleans build folders and unused assets when rebuilding
    // new CleanWebpackPlugin(), // <- sostituito da `output.clean: true`

    // Extracts CSS into separate files
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      // chunkFilename: '[id].css',
      chunkFilename: '[name].[id].[contenthash].css',
    }),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets/imgs/*.svg',
          to: path.resolve(__dirname, buildPath + '/imgs') + '/[name][ext]',
          globOptions: {
            ignore: ['*.DS_Store'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),

    // // local API URL
    // new webpack.DefinePlugin({ 'API_URL': JSON.stringify('http://ada.local:8888') }),

    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      filename: '../../../templates/convention23/[name]-head.html.twig',
      inject: false,
      templateContent: ({htmlWebpackPlugin}) => {
        let tpl = '';

        const js_files = typeof htmlWebpackPlugin.files.js === 'object'?
          htmlWebpackPlugin.files.js : [htmlWebpackPlugin.files.js];
        const css_files = typeof htmlWebpackPlugin.files.css === 'object'?
          htmlWebpackPlugin.files.css : [htmlWebpackPlugin.files.css];

        if(css_files.length) {
          tpl += css_files.map(item =>
            `<link rel="preload" href="${item}" as="style">`+
            `<link rel="stylesheet" href="${item}" type="text/css" media="all">`
          ).join('');
        }

        if(js_files.length) {
          tpl += js_files.map(item =>
            `<link rel="preload" href="${item}" as="script">` +
            `<script src="${item}" defer fetchpriority="high"></script>`
          ).join('');
        }

        return tpl;
      },
    }),

    new WebpackManifestPlugin(),

    new BannerPlugin({
      banner: () => {
        const date = new Date().toLocaleString('it-IT', { year: 'numeric', month: 'long' });

        // version = /(-alpha|-beta|-rc)/.test(PACKAGE.version)? PACKAGE.version :
        //   PACKAGE.version.replace(/(\d+\.\d+)\.\d+/, '$1.x');

        return '/*!\n' +
          ` * Convention Bluvacanze '23 v.${PACKAGE.version} - Massimo Cassandro / Gianluca Canale ${date}\n` +
          ' */\n';
      },
      raw: true
    })
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [

      // JavaScript/JSX: Use Babel to transpile JavaScript files
      // {
      //   test: /\.jsx?$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //   },
      // },
      // Images: Copy image files to build folder
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|avif)$/i,
        // type: 'asset/resource',
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              outputPath: 'imgs/',
              esModule: false,

            }
          }
        ]
      },

      // Fonts and SVGs
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        //type: 'asset/resource',
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              outputPath: '/fonts',
              // publicPath: '...'
              esModule: false,
            }
          }
        ]
      },

      // scss modules
      // {
      //   test: /\.module\.s(a|c)ss$/,
      //   use: [
      //     isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         // modules: true,
      //         modules: {
      //           auto: true, // /\.module\.scss$/i.test(filename),
      //           // localIdentName: Encore.isProduction()? '[hash:base64]' : '[local]_[hash:base64:6]' // '[name]__[local]_[hash:base64:5]'
      //           localIdentName: '[local]_[hash:base64:6]' // '[name]__[local]_[hash:base64:5]'
      //         },
      //         sourceMap: isDevelopment
      //       }
      //     },
      //     {
      //       loader: 'sass-loader',
      //       options: {
      //         sourceMap: isDevelopment
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.(sass|scss|css)$/,
        exclude: /\.module.(s?(a|c)ss)$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: buildSourcemaps,
              importLoaders: isDevelopment? 1 : 2,
              modules: false
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                sourceMap: buildSourcemaps
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: buildSourcemaps
            }
          },
        ],
      },
    ],
  },

  resolve: {
    fallback: {
      'fs': false,
      'util': false
    },
    modules: ['./', 'node_modules'],
    extensions: ['.js', '.jsx', '.json', 'scss'],
    alias: {
      '@': './',
      assets: buildPath,
    },
  }

};


module.exports = config;
