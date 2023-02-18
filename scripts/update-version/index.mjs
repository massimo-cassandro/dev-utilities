/* eslint-env node */
/* eslint-disable no-console */

// shell: npm info YOUR_PACKAGE version
import * as fs from 'fs';
// import inquirer from 'inquirer';
import chalk from 'chalk';
import clipboard from 'clipboardy';

import getConfig from '../shared/getConfig.mjs';
import { params } from './src/params.mjs';
import { updateLog } from './src/updateLog.mjs';
import { updateFiles } from './src/updateFiles.mjs';
import { updateVersion } from './src/updateVersion.mjs';
import { chooser } from './src/chooser-inquirer.mjs';


// https://github.com/chalk/chalk
// https://github.com/SBoudrias/Inquirer.js

const log = console.log;

// se true utilizza come versione di partenza il valore della variabile `debug_start_release`
// e non scrive nulla ma restituisce in console l'oggetto dei parametri elaborati
const debug = false,
  debug_start_release = '1.0.0-beta.2';
// process.argv.push('--patch-only'); // per debug


try {

  // lettura versione e inizializzazione variabili
  params.preRelease = false;

  if(debug) {
    params.oldVersion = debug_start_release.toLowerCase();

  } else {
    let file_content = fs.readFileSync(params.packageJsonFile, 'utf8');
    params.packageJsonContent = JSON.parse(file_content);
    params.oldVersion = params.packageJsonContent.version.toLowerCase();
  }

  if(params.preRealeaseTags.some(tag => params.oldVersion.indexOf(`-${tag}.`) !== -1 )) {

    const temp = params.oldVersion.split('-');
    params.versionArray = temp[0].split('.').map((i) => +i);
    params.versionArray = params.versionArray.concat(
      temp[1].split('.').map((i) => (isNaN(i) ? i : +i))
    );

    params.preRelease = params.versionArray[3];

  } else {
    params.versionArray = params.oldVersion.split('.').map(i => +i);
  }

  if((params.preRelease === false && params.versionArray.length > 3) ||
    (params.preRelease !== false && params.preRealeaseTags.indexOf(params.preRelease) === -1) // non dovrebbe essere necessario
  ) {
    throw 'Pre-release tag non mappato';
  }

  // ********************************************

  const runUpdate = (mode) => {

    updateVersion(mode);

    params.log_item.vers = params.newVersion;

    if(params.log_item.descr) {
      clipboard.writeSync(params.log_item.vers + ' - ' + params.log_item.descr);
    }

    if(debug) {
      console.log(params);

    } else {
      updateFiles();
      updateLog();
    }

  }; // end runUpdate

  // ********************

  // =>> lettura configurazione e avvio

  new Promise((resolve, reject) => {

    const cfg_param_index = process.argv.findIndex(el => /^--config/.test(el) );

    if(cfg_param_index !== -1) {
      let [, cfgPath] = process.argv[cfg_param_index].split('=');

      getConfig(cfgPath, params.configProperty)
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

      params.cfg = {...params.cfgDefaults, ...(parsedCfg?? {})};

      // parametri cli con precedenza rispetto a quelli del file cfg
      if(process.argv.findIndex(el => el === '--patch-only') !== -1) {
        params.cfg.patchOnly = true;
      }

      if(process.argv.findIndex(el => el === '--skip-descr-prompt') !== -1) {
        params.cfg.skipDescrPrompt = true;
      }

      log(chalk.dim(`\nVersione package.json attuale: ${params.oldVersion}\n`));

      (async () => {
        const choice = await chooser();
        if(debug) {
          console.log(`\n**********\n${choice}\n**********\n`);
        }
        runUpdate(choice);
      })();

    })
    .catch(err => {
      throw err;
    });

} catch (err) {
  console.error(chalk.bgRed(` ${err} `));
}

