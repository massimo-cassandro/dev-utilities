/* eslint-env node */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const {BannerPlugin} = require('webpack');
const PACKAGE = require('./package.json');
const path = require('path');



// const Dotenv = require('dotenv-webpack');
const isDevelopment = process.env.NODE_ENV === 'development',
  buildSourcemaps = isDevelopment;

const config = {
  mode: isDevelopment? 'development' : 'production',

  watch: isDevelopment,

  // Control how source maps are generated
  // devtool: isDevelopment? 'inline-source-map' : 'source-map', // false, <== false non aggiunge la sourcemap ,
  devtool: isDevelopment? 'inline-source-map' : false,
  // devtool: 'source-map',

  // Where webpack looks to start building the bundle
  entry: {
    'my-app-name': './src/index.tsx',
  },
  // Where webpack outputs the assets and bundles

  output: {
    path: path.resolve(__dirname, './build'),
    // filename: '[name].js',
    filename: '[name].[contenthash].js',
    publicPath: 'auto',
    clean: !isDevelopment,
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
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, '/'),
      serveIndex: true,
    },

    open: true,
    compress: true,
    hot: true,
    // host: '0.0.0.0',
    port: 5507,
  },

  plugins: [

    // new Dotenv({
    //   path: isDevelopment? './.env.development' : './.env',
    //   expand: true,
    //   ignoreStub: true
    // }),

    // Removes/cleans build folders and unused assets when rebuilding
    // new CleanWebpackPlugin(),

    // Extracts CSS into separate files
    new MiniCssExtractPlugin({
      filename: isDevelopment? '[name].css' : '[name].[contenthash].css',
      chunkFilename: isDevelopment? '[id].css' : '[id].[contenthash].css'
    }),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/**/*.{ico,png,svg,webmanifest}',
          to: '[name][ext]',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/index.html', '**/.DS_Store'],
          },
        },
      ],
    }),

    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),

    // https://github.com/jantimon/html-webpack-plugin#readme
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, './public/index.html'),
      inject: 'body',
      title: 'My App',
      // templateContent: ({htmlWebpackPlugin}) => {
      //   let tpl = '';

      //   const js_files = typeof htmlWebpackPlugin.files.js === 'object'?
      //     htmlWebpackPlugin.files.js : [htmlWebpackPlugin.files.js];
      //   const css_files = typeof htmlWebpackPlugin.files.css === 'object'?
      //     htmlWebpackPlugin.files.css : [htmlWebpackPlugin.files.css];

      //   if(css_files.length) {
      //     tpl += css_files.map(item =>
      //       `<link rel="preload" href="${item}" as="style">`+
      //       `<link rel="stylesheet" href="${item}" type="text/css" media="all">`
      //     ).join('');
      //   }

      //   if(js_files.length) {
      //     tpl += js_files.map(item =>
      //       `<link rel="preload" href="${item}" as="script">` +
      //       `<script src="${item}" defer fetchpriority="high"></script>`
      //     ).join('');
      //   }

      //   return tpl;
      // },
    }),

    new WebpackManifestPlugin(),

    new BannerPlugin({
      banner: () => {
        const date = new Date().toLocaleString('it-IT', { year: 'numeric', month: 'long' });

        // version = /(-alpha|-beta|-rc)/.test(PACKAGE.version)? PACKAGE.version :
        //   PACKAGE.version.replace(/(\d+\.\d+)\.\d+/, '$1.x');

        return '/*!\n' +
          ` * My App v.${PACKAGE.version} - Massimo Cassandro ${date}\n` +
          ' */\n';
      },
      raw: true
    })
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // {
      //   test: /\.html$/,
      //   loader: 'html-loader'
      // },

      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      // JavaScript/JSX: Use Babel to transpile JavaScript files
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }]
            ]
          },
        },
      },
      // inline svg
      {
        test: /\.inline\.svg$/i,
        type: 'asset/inline'
      },

      // Images: Copy image files to build folder
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|avif|svg)$/i,
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
        test: /\.(woff2?|eot|ttf|otf)$/,
        //type: 'asset/resource',
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              hmr: isDevelopment,
              name: '[name].[contenthash].[ext]',
              outputPath: '/fonts',
              // publicPath: 'convention23/build/fonts',
              esModule: false,
            }
          }
        ]
      },

      // scss modules
      {
        test: /\.module\.s(a|c)ss$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // modules: true,
              modules: {
                auto: true, // /\.module\.scss$/i.test(filename),
                // localIdentName: Encore.isProduction()? '[hash:base64]' : '[local]_[hash:base64:6]' // '[name]__[local]_[hash:base64:5]'
                localIdentName: '[local]_[hash:base64:6]' // '[name]__[local]_[hash:base64:5]'
              },
              sourceMap: isDevelopment
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      },
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
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.scss'],
    alias: {
      '@': './',
      assets:'./build',
    },
  }

};


module.exports = config;
