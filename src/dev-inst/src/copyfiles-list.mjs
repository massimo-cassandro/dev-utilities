// ogni elemento:
// nome file (all'interno della dir templates) => nome da assegnare durante la copia
export const files = {
  '.editorconfig': [{source: '_editorconfig.txt', target: '.editorconfig'}],
  '_gitignore (da editare)': [{source: '_gitignore.txt', target: '_gitignore'}],
  'package.jsonc (da editare)': [{source: 'package.jsonc', target: 'package.jsonc'}],
  'postcss.config.js': [{source: 'postcss.config.js', target: 'postcss.config.js'}],
  'rollup.config.mjs': [{source: 'rollup.config.mjs', target: 'rollup.config.mjs'}],
  'webpack.config.js': [{source: 'webpack.config.js', target: 'webpack.config.js'}],
  'webpack html template': [{source: 'webpack-template.html', target: 'webpack-template.html'}],
  '_htaccess (da editare)': [{source: '_htaccess.txt', target: '_htaccess'}],
  '.npmignore': [{source: '_npmignore.txt', target: '.npmignore'}],
  '.stylelintignore': [{source: '_stylelintignore.txt', target: '.stylelintignore'}],
  '.eslintignore': [{source: '_eslintignore.txt', target: '.eslintignore'}],
  'dev-utilities.config.mjs': [{source: 'dev-utilities.config.mjs', target: 'dev-utilities.config.mjs'}],

};
