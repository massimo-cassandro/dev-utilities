const packages_list = [
  {
    label: 'base (dev-utilities + linters-config)',
    packages: ['@massimo-cassandro/dev-utilities', '@massimo-cassandro/linters-config'],
    dev: true,
  },
  {
    label: 'rollup base',
    packages: [
      'rollup@latest',
      '@rollup/plugin-terser',
      '@rollup/plugin-node-resolve',
      '@rollup/plugin-json',
      '@rollup/plugin-image',
      '@rollup/plugin-replace',
      '@rollup/plugin-commonjs',
    ],
    dev: true
  },
  {
    label: 'rollup-plugin-string-html',
    packages: ['rollup-plugin-string-html'],
    dev: true,
  },

  // 'npm i --save-dev rollup-plugin-minify-html-template-literals',

  {
    label: 'sass cli',
    packages: ['sass'],
    dev: true,
  },
  {
    label: 'postcss + csso + autoprefixer + purgecss',
    packages: [
      'postcss',
      '@fullhuman/postcss-purgecss',
      'autoprefixer',
      'postcss-csso',
    ],
    dev: true,
  },
  {
    label: 'postcss cli',
    packages: ['postcss-cli'],
    dev: true
  },
  {
    label: 'postcss-banner',
    packages: ['postcss-banner'],
    dev: true
  },

  {
    label: 'bootstrap',
    packages: ['bootstrap'],
    dev: false
  },
  {
    label: 'gulp per icone',
    packages: [
      'gulp@latest',
      'gulp-concat',
      'gulp-dom',
      'gulp-flatmap',
      'gulp-inject-string',
      'gulp-jsbeautifier',
      'gulp-rename',
      'gulp-replace',
      'gulp-svgmin',
      'gulp-svgstore',
    ],
    dev: true
  },
  {
    label: 'gulp-wrap (aggiunta per icone react)',
    packages: ['gulp-wrap'],
    dev: true
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
  {
    label: 'open-props',
    packages: ['open-props', 'postcss-jit-props'],
    dev: false,
  },


  {
    label: 'react',
    packages: [
      '@babel/preset-react',
      'babel-plugin-transform-react-remove-prop-types',
      'classnames',
      'dotenv-webpack',
      'eslint-config-react-app',
      'nanoid',
      'prop-types',
      'react-dom',
      'react',
    ],
    dev: true,
  },
  {
    label: 'styled-components',
    packages: ['styled-components'],
    dev: true,
  },
  {
    label: 'react-html-comment',
    packages: ['react-html-comment'],
    dev: true,
  },
  {
    label: 'html-react-parser',
    packages: ['html-react-parser'],
    dev: true,
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
    dev: true
  },
  {
    label: 'typescript per react/webpack',
    packages: [
      '@types/react-dom',
      '@types/react',
      'ts-loader',
      'typescript-plugin-css-modules',
      'typescript'
    ],
    dev: true,
  },

].concat([
  'auto-datatables-bs5',
  'autocomplete',
  'ckeditor-utilities',
  'cookie-consent',
  'js-file-uploader',
  'js-utilities',
  'json-table',
  'modal-alert',
  'scss-utilities',
  'sharing-links',
  'unsplash-page'
].map(item =>{
  return {
    label: `@massimo-cassandro/${item}`,
    packages: [`@massimo-cassandro/${item}`],
    dev: false,
  };

}));

packages_list.sort((a,b) => {
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }

  // names must be equal
  return 0;
});

export {packages_list};
