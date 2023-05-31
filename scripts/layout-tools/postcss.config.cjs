/* eslint-env node */

// const path = require('path');

// https://github.com/postcss/postcss-cli
// https://purgecss.com/configuration.html
// const purgecss = require('@fullhuman/postcss-purgecss');

// https://www.npmjs.com/package/postcss-banner
const postcssBanner = require('postcss-banner');
const PACKAGE = require('../../package.json');

// const dev = cfg.env === 'development'; // richiede `--env development` nel comando cli


module.exports = {

  map: true,
  parser: 'postcss-scss',

  plugins: [
    require('autoprefixer'),

    postcssBanner({
      banner: `@massimo-cassandro/dev-utilities v.${PACKAGE.version} - ${new Date().toLocaleString('it-IT', { year: 'numeric', month: 'long' })}`,
      important: true
    }),
    require('postcss-csso')({
      restructure: false,
      // sourceMap: true,
      stat: true,
      forceMediaMerge: true
    }),
    require('postcss-advanced-variables'),
    require('postcss-nested'),

    // purgecss({
    //   content: [
    //     sf_public_dir + '/js/**/*.js',
    //     sf_public_dir + '/apps/**/*.js',
    //     sf_public_dir + '/apps-r/**/*.js',
    //     sf_public_dir + '/apps-r/**/*.twig',
    //     sf_public_dir + '/**/*.twig'
    //   ],
    //   // css: ['./AppBundle/Resources/public/css/**/*.css'],
    //   // output: ['./AppBundle/Resources/public/css/'],
    //   // variables: true,
    //   // fontFace: true,
    //   safelist: {
    //     standard: [/rounded-pill$/],
    //     deep: [
    //       /^col-/, /^row/, /^sharing-links/, /^fupl/, /^rcolumns/, /^d-/,
    //       /^position-/, /^flex-/, /^container/, /^tooltip/, /^bs-/,/^col-/, /^row/,
    //       /^rcolumns/, /^d-/, /^row-cols/,  /^offset/,
    //       /^position-/, /^flex-/, /^align-/, /^justify-/, /^order-/, /^container/, /^tooltip/, /^bs-/,
    //       /^mt-/, /^mr-/, /^mb-/, /^ml-/, /^pt-/, /^pr-/, /^pb-/, /^pl-/,
    //       /^me-/, /^ms-/, /^pe-/, /^ps-/,
    //       /^m-alert/, /^sf-/, /^form-/, /^grecaptcha-/, /^box/, /^sharing-links/,
    //       /^was-validated/, /^is-valid/, /^is-invalid/, /^border/,
    //       /^font-/,

    //       /^sticky-/, /^badge/, /^rounded-/,
    //       /^table/,

    //       /^btn/, /^input-group/, /^alert/, /^bs-/, /^spinner/, /^embed-/,
    //       /^(min-|max-)?(m|p|vh|vw|w|h)(t|r|b|l|x|y)?-/,

    //       /^hmenu/,
    //       /^select2/,
    //       /^mAlert/,
    //       /^carousel/,
    //       /^justify-/,
    //       /^autocomplete/,
    //       /^rating/

    //     ],
    //     // greedy: [/yellow$/]
    //   }
    // }),

  ]
};
