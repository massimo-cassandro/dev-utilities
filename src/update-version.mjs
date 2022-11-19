/* eslint-env node */
/* eslint-disable no-console */

/**
 * Recupera e incrementa il numero di versione del package
 *
 * se presente il flag `--twig-vars-file=path/to/file/config.html.twig`,
 *   aggiorna anche l'elemento `vers` della variabile twig `glob_vars`
 *   contentuta in `path/to/file/config.html.twig`
 *
 * la presenza del flag `--patch-only` fa in modo che non sia impostato direttamente
 * l'aggiornamento della patch versione senza necessità di ulteriori interazioni
 *
 * Ogni aggiornamento aggiunge un elemento al file `changelog.json` posizionato
 * sulla root del progetto
 * Ogni elemento contiene la versione, la data e opzionalmente um testo descrittivo
 * Il prompt per il testo descrittivo non viene richiesto in presenza dei flag `--no-log`
 */

// shell: npm info YOUR_PACKAGE version
import * as fs from 'fs';
import inquirer from 'inquirer';
import chalk from 'chalk';

const log = console.log;

// https://github.com/chalk/chalk
// https://github.com/SBoudrias/Inquirer.js


// TODO optimize inquirer promises
// TODO copy descr to clipboard to use for commit message

try {

  const package_json_file = './package.json',
    log_file = './changelog.json';

  let file_content = fs.readFileSync(package_json_file, 'utf8');
  const package_json = JSON.parse(file_content),
    version = package_json.version;

  let version_array = version.split('.').map(i => +i);

  // twig
  let twig_file = null,
    patchOnly = false,
    log_prompt = true;

  process.argv.forEach(function (param) {
    if(/^--twig-vars-file/.test(param)) {
      [, twig_file] = param.split('=');
    }

    if(/^--patch-only$/.test(param)) {
      patchOnly = true;
    }

    if(/^--no-log$/.test(param)) {
      log_prompt = false;
    }

  });

  const updateLog = (item) => {
    let changelog;
    if(fs.existsSync(log_file)) {
      changelog = JSON.parse(fs.readFileSync(log_file, 'utf8'));
    } else {
      changelog = [];
    }
    changelog.push(item);
    fs.writeFileSync(log_file, JSON.stringify(changelog, null, '  '));
  };

  const updateVers = (mode) => {

    if(mode === 'minor') {
      version_array[1]++;
      version_array[2] = 0;

    } else if( mode === 'patch') {
      version_array[2]++;
    }

    let new_version = version_array.join('.');

    package_json.version = new_version;
    fs.writeFileSync(package_json_file, JSON.stringify(package_json, null, '  '));


    const writeFiles = () => {
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
    };

    const log_item = {
      date: new Date().toISOString(),
      vers: new_version,
      descr: null
    };

    if(log_prompt) {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'descr',
            message: 'Descrizione: ',
            default() {
              return null;
            }
          }
        ])
        .then((answer) => {
          log_item.descr= answer.descr.trim()? answer.descr.trim() : null;
          updateLog(log_item);
          writeFiles();
        });
    } else {
      updateLog(log_item);
      writeFiles();
    }

  }; // end updateVers


  log(chalk.dim(`\nVersione package.json attuale: ${version}\n`));


  if(patchOnly) {
    updateVers('patch');

  } else {
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
        if(answer.mode !== 'none') {
          updateVers(answer.mode);
        } else {
          console.log(chalk.blue('Operazione annullata'));
        }

      });
  } // end if patchOnly

} catch (err) {
  console.error(chalk.red(`${err}`));
}

