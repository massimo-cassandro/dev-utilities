/* eslint-env node */

/* eslint-env node */

module.exports = {
  plugins: [

    require('autoprefixer'),

    // https://purgecss.com/configuration.html
    require('@fullhuman/postcss-purgecss')({
      content: [
        './node_modules/@massimo-cassandro/**/*.js',
        './node_modules/@massimo-cassandro/**/*.jsx',
        './assets/**/*.js',
        '../blunet-sf/templates/convention23/**/*.html.twig'
      ],
      // css: ['./AppBundle/Resources/public/css/**/*.css'],
      // output: ['./AppBundle/Resources/public/css/'],
      // variables: true,
      // fontFace: true,
      safelist: {
        standard: [
          'font-monospace', 'was-validated', 'is-valid', 'is-invalid', 'lead',
          /* 'container-xl', */ 'container-xxl'
        ],
        deep: [
          /^text-/, /^pagination/, /^page-/, /^alert/, /^[mp][tbselrxy]?-(.{2,3}-)?[\d(auto)]/,
          /^col-/, /^row/, /^btn-/, /^d-/, /^fw-/, /* /^btn-/, */

          /^mAlert/, /^modal-alert/, /^ac-/, /^fupl/,

          // yet-another-react-lightbox
          /^yarl/,

          // cookie consent
          // /^cck-/, /^wt-ecl-/

        ],
        // greedy: [/yellow$/]
      }
    }),


    require('postcss-csso')({
      restructure: false,
      // sourceMap: true,
      stat: true,
      forceMediaMerge: true
    })
  ]
};
