export const defaultPackageValues = {
  id: null, // id univoco del record o null
  packages: [], // packages
  dev: false, // true => devDepencies
  hint: null,
  merge: [] // altri record da includere (lista di id)
};

const packages = [
  {
    label: 'base',
    packages: ['@massimo-cassandro/dev-utilities', '@massimo-cassandro/linters-config'],
    dev: false,
    hint: 'dev-utilities + linters-config'
  },
  {
    label: 'rollup',
    packages: [
      'rollup@latest',
      '@rollup/plugin-terser',
      '@rollup/plugin-node-resolve',
      '@rollup/plugin-json',
    ],
    dev: false
  },
  {
    label: 'rollup commonjs',
    packages: ['rollup/plugin-commonjs'],
    dev: false,
    hint: null
  },
  {
    label: 'rollup-plugin-string-html',
    packages: ['rollup-plugin-string-html'],
    dev: false,
    hint: null
  },
  // 'npm i --save-dev rollup-plugin-minify-html-template-literals',
  {
    id: 'sass',
    label: 'sass cli',
    packages: ['sass'],
    dev: false,
    hint: null
  },
  {
    id: 'postcss',
    label: 'postcss',
    packages: [
      'postcss',
      '@fullhuman/postcss-purgecss',
      'autoprefixer',
      'postcss-csso',
    ],
    dev: false,
    hint: 'postcss + csso + autoprefixer + purgecss'
  },
  {
    label: 'postcss cli',
    packages: ['postcss-cli'],
    dev: true,
    hint: null
  },
  {
    label: 'postcss-banner',
    packages: ['postcss-banner'],
    dev: false,
    hint: null
  },
  // 'npm i --save-dev postcss @fullhuman/postcss-purgecss autoprefixer postcss-csso sass gulp gulp-using gulp-postcss gulp-sass gulp-sourcemaps',

  {
    label: 'bootstrap',
    packages: ['bootstrap'],
    dev: false,
    hint: null
  },
  {
    label: 'gulp per icone',
    packages: [
      'gulp@latest',
      'gulp-dom',
      'gulp-rename',
      'gulp-replace',
      'gulp-svgmin',
      'gulp-svgstore',
      'gulp-jsbeautifier',
      'gulp-concat',
      'gulp-flatmap',
      'gulp-inject-string'
    ],
    dev: true,
    hint: null
  },
  {
    label: 'gulp aggiunta per icone react',
    packages: ['gulp-wrap'],
    dev: true,
    hint: 'gulp-wrap'
  },
  {
    label: 'primsjs',
    packages: ['prismjs'],
    dev: false,
  },
  {
    label: 'normalize.css',
    packages: ['normalize.css'],
    dev: false,
  },
  // 'npm i --save @fontsource/xxxxx'

  {
    label: 'react',
    packages: [
      'react',
      'react-dom',
      'classnames',
      'prop-types',
      'dotenv-webpack',
      'eslint-config-react-app',
      '@babel/preset-react',
      'babel-plugin-transform-react-remove-prop-types',
      'nanoid'
    ],
    dev: false,
  },
  {
    label: 'styled-components',
    packages: ['styled-components'],
    dev: false,
  },
  {
    label: 'react-html-comment',
    packages: ['react-html-comment'],
    dev: false,
  },
  {
    label: 'html-react-parser',
    packages: ['html-react-parser'],
    dev: false,
  },
  {
    label: 'webpack',
    packages: [
      '@babel/core',
      '@babel/plugin-proposal-class-properties',
      '@babel/preset-env',
      'babel-loader',
      'babel-plugin-styled-components',
      // 'clean-webpack-plugin',
      'copy-webpack-plugin',
      'css-loader',
      'css-minimizer-webpack-plugin',
      'csso-webpack-plugin',
      'dotenv-webpack',
      'file-loader',
      'html-loader',
      'html-webpack-plugin',
      'mini-css-extract-plugin',
      'postcss-loader',
      'postcss-preset-env',
      'sass-loader',
      'style-loader',
      'terser-webpack-plugin',
      'webpack-cli',
      'webpack-dev-server',
      'webpack-manifest-plugin',
      'webpack-remove-empty-scripts',
      'webpack'
    ],
    dev: false,
    merge: ['postcss', 'sass']
  },

].concat([
  'js-utilities',
  'modal-alert',
  'auto-datatables-bs5',
  'json-table',
  'js-file-uploader',
  'autocomplete',
  'scss-utilities',
  'ckeditor-utilities',
  'cookie-consent',
  'sharing-links'
].map(item =>{
  return {
    label: `@massimo-cassandro/${item}`,
    packages: [`@massimo-cassandro/${item}`],
    dev: false,
  };

}));

export {packages};
