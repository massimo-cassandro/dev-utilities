/* eslint-env node */
/* eslint-disable no-console */

// shell: npm info YOUR_PACKAGE version
import * as fs from 'fs';
import inquirer from 'inquirer';
import chalk from 'chalk';
import clipboard from 'clipboardy';
import getConfig from './src/getConfig.mjs';


// https://github.com/chalk/chalk
// https://github.com/SBoudrias/Inquirer.js

const log = console.log,
  package_json_file = './package.json',
  log_file = './changelog.txt',
  cfg_prop = 'updateVersion', // chiave proprietà nel file di configurazione

  // defaults configurazione
  cfgDefaults = {
    twigVarsFile     : null,
    htmlFiles        : null,
    skipDescrPrompt  : false,
    patchOnly        : false,
    defaultDescr     : null
  };


try {

  let file_content = fs.readFileSync(package_json_file, 'utf8');
  const package_json = JSON.parse(file_content),
    version = package_json.version;

  let version_array = version.split('.').map(i => +i),
    cfg = {};

  // ********************************************


  const updateLog = (item) => {
    /* let changelog;
    if(fs.existsSync(log_file)) {
      changelog = JSON.parse(fs.readFileSync(log_file, 'utf8'));
      changelog.sort((a,b) => a.date < b.date);

    } else {
      changelog = [];
    }

    changelog.unshift(item);

    fs.writeFileSync(log_file, JSON.stringify(changelog, ['vers', 'date', 'descr'], '')
      .replace(/\[/, '[\n')
      .replace(/},/g, '},\n')
    ); */

    let row = item.date + ' | ' +
      (' '.repeat(10) + item.vers).slice(-10) + ' | ' +
      (item.descr !== null? item.descr : '');

    fs.appendFileSync(log_file, row + '\n');
  };


  const updateVers = (mode) => {


    if(mode === 'major') {
      version_array[0]++;
      version_array[1] = 0;
      version_array[2] = 0;

    } else if(mode === 'minor') {
      version_array[1]++;
      version_array[2] = 0;

    } else if( mode === 'patch') {
      version_array[2]++;
    }

    let new_version = version_array.join('.');

    const writeFiles = () => {

      package_json.version = new_version;
      fs.writeFileSync(package_json_file, JSON.stringify(package_json, null, '  '));

      if(cfg.twigVarsFile) {

        file_content = fs.readFileSync(cfg.twigVarsFile, 'utf8');
        file_content = file_content.replace(/vers: '\d+\.\d+\.\d+'/, `vers: '${new_version}'`);
        fs.writeFileSync(cfg.twigVarsFile, file_content);
        log(chalk.dim(`\nAggiornamento file twig: ${cfg.twigVarsFile}`));
      }

      if(cfg.htmlFiles) {
        cfg.htmlFiles.forEach(file => {
          file_content = fs.readFileSync(file, 'utf8');
          file_content = file_content.replace(/\.(js|css)(\?|&)(_|v)=\d+\.\d+\.\d+(-(rc\.)?\d+)?/g, `.$1$2$3=${new_version}`);
          fs.writeFileSync(file, file_content);
          log(chalk.dim(`\nAggiornamento file html: ${file}`));
        });
      }

      const outputString = `│  👍 Versione aggiornata: ${version} → ${new_version}  │`,
        frameLine = '─'.repeat(outputString.length - 2);

      log(chalk.yellow('\n┌' + frameLine + '┐'));
      log(chalk.yellow(outputString));
      log(chalk.yellow('└' + frameLine + '┘\n'));
    };

    const log_item = {
      vers: new_version,
      date: new Date().toISOString(),
      descr: null
    };

    if(!cfg.skipDescrPrompt) {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'descr',
            message: 'Descrizione: ',
            default() {
              return cfg.defaultDescr;
            }
          }
        ])
        .then((answer) => {
          log_item.descr= answer.descr.trim()? answer.descr.trim() : null;
          if(log_item.descr) {
            clipboard.writeSync(log_item.vers + ' - ' + log_item.descr);
          }
          updateLog(log_item);
          writeFiles();
        });
    } else {
      updateLog(log_item);
      writeFiles();
    }

  }; // end updateVers


  // ********************
  // ********************

  // =>> lettura configurazione e avvio

  new Promise((resolve, reject) => {

    const cfg_param_index = process.argv.findIndex(el => /^--config/.test(el) );

    if(cfg_param_index !== -1) {
      let [, cfgPath] = process.argv[cfg_param_index].split('=');

      getConfig(cfgPath, cfg_prop)
        .then(parsedCfg => {
          if(parsedCfg === false) {
            reject('Errore nella lettura del file di configurazione');
          } else {
            resolve(parsedCfg);
          }
        });

    } else {

      // TODO deprecati, mantenuti per compatiubilità con le versioni precedenti
      // questa parte sarà rimossa nelle prossime versioni

      let parsedCfg = {};
      process.argv.forEach(param => {

        if(/^--twig-vars-file/.test(param)) {
          [, parsedCfg.twigVarsFile] = param.split('=');
        }

        if(/^--html-files/.test(param)) {
          [, parsedCfg.htmlFiles] = param.split('=');
          parsedCfg.htmlFiles = parsedCfg.htmlFiles.split(',');
        }

        if(/^--default-descr=(.*?)$/.test(param)) {
          [, parsedCfg.defaultDescr] = param.split('=');
        }

      });

      resolve(parsedCfg);

    }

  })
    .then( parsedCfg => {

      cfg = {...cfgDefaults, ...(parsedCfg?? {})};

      // parametri cli con precedenza rispetto a quelli del file cfg
      if(process.argv.findIndex(el => el === '--patch-only') !== -1) {
        cfg.patchOnly = true;
      }
      if(process.argv.findIndex(el => el === '--skip-descr-prompt') !== -1) {
        cfg.skipDescrPrompt = true;
      }

      log(chalk.dim(`\nVersione package.json attuale: ${version}\n`));

      if(cfg.patchOnly) {
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
                  name: 'Aggiorna la major version',
                  value: 'major',
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

      } // end else if patchOnly


    })
    .catch(err => {
      throw err;
    });

} catch (err) {
  console.error(chalk.bgRed(` ${err} `));
}

