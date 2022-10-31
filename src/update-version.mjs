/* eslint-env node */
/* eslint-disable no-console */

/**
 * Recupera e incrementa il numero di versione del package
 * se presente il flag `--twig-main-glob_vars=path/to/file/config.html.twig`,
 *   aggiorna anche l'elemento `vers` della variabile twig `glob_vars`
 *   contentuta in `path/to/file/config.html.twig`
 */

// shell: npm info YOUR_PACKAGE version
import * as fs from 'fs';
import inquirer from 'inquirer';
import chalk from 'chalk';

const log = console.log;

try {

  const package_json_file = './package.json';

  let file_content = fs.readFileSync(package_json_file, 'utf8');
  const package_json = JSON.parse(file_content),
    version = package_json.version;

  let version_array = version.split('.').map(i => +i);

  // twig
  let twig_file = null;

  process.argv.forEach(function (param) {
    if(/^--twig-main-glob_vars/.test(param)) {

      [, twig_file] = param.split('=');
    }

  });


  log(chalk.dim(`\nVersione package.json attuale: ${version}\n`));


  inquirer
    .prompt([
      {
        type: 'list',
        default: 0,
        name: 'mode',
        message: 'Aggiorna:',
        choices: [
          {
            name: 'Aggiorna la patch version',
            value: 'patch',
          },
          {
            name: 'Aggiorna la minor version',
            value: 'minor',
          },
          {
            name: 'Annulla',
            value: 'none',
          }
        ]
      }
    ])
    .then((answer) => {

      if(answer.mode === 'minor') {
        version_array[1]++;
        version_array[2] = 0;

      } else if( answer.mode === 'patch') {
        version_array[2]++;

      // } else if(answer === 'none' ) { // no update
      }

      let new_version = version_array.join('.');

      package_json.version = new_version;
      fs.writeFileSync(package_json_file, JSON.stringify(package_json, null, '  '));

      if(twig_file) {

        file_content = fs.readFileSync(twig_file, 'utf8');
        file_content = file_content.replace(/vers: '\d+\.\d+\.\d+'/, `vers: '${new_version}'`);
        fs.writeFileSync(twig_file, file_content);
        log(chalk.dim(`\nAggiornamento file twig: ${twig_file}`));
      }

      const outputString = `│  👍 Versione aggiornata: ${version} → ${new_version}  │`,
        frameLine = '─'.repeat(outputString.length - 2);

      log(chalk.yellow('\n┌' + frameLine + '┐'));
      log(chalk.yellow(outputString));
      log(chalk.yellow('└' + frameLine + '┘\n'));


    });



} catch (err) {
  console.error(chalk.red(`${err}`));
}

