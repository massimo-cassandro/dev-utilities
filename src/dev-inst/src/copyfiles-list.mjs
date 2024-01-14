// ogni elemento:
// nome file (all'interno della dir templates) => nome da assegnare durante la copia
export const files = {
  '.editorconfig': [{source: '_editorconfig.txt', target: '.editorconfig'}],
  '.gitignore': [{source: '_gitignore.txt', target: '.gitignore'}],
  'package.jsonc': [{source: 'package.jsonc', target: 'package.jsonc'}],
  'postcss.config.js': [{source: 'postcss.config.js', target: 'postcss.config.js'}],
  'rollup.config.mjs': [{source: 'rollup.config.mjs', target: 'rollup.config.mjs'}],
  'webpack.config.js': [{source: 'webpack.config.js', target: 'webpack.config.js'}],
  'webpack html template': [{source: 'webpack-template.html', target: 'webpack-template.html'}],
  '.npmignore': [{source: '_npmignore.txt', target: '.npmignore'}],
  '.stylelintignore': [{source: '_stylelintignore.txt', target: '.stylelintignore'}],
  '.eslintignore': [{source: '_eslintignore.txt', target: '.eslintignore'}],
  'dev-utilities.config.mjs': [{source: 'dev-utilities.config.mjs', target: 'dev-utilities.config.mjs'}],

};
