#!/usr/bin/env node

/* eslint-disable no-console */
/* eslint-env node */

// create favicons files as in
// https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs (2023 vers.)


import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

import chalk from 'chalk';

import { createFavicons } from './src/create-favicons.mjs';
import { defaults } from './src/defaults.mjs';

// nome del file di configurazione, se utilizzato
const cfg_filename = 'create-favicons-cfg.mjs';

try {

  // init: creazione file cfg base
  if(process.argv.indexOf('init') !== -1) {

    // const __filename = new URL('', import.meta.url).pathname;
    // Will contain trailing slash
    const __dirname = new URL('.', import.meta.url).pathname,
      cfg_sample_file = __dirname + 'create-favicons-cfg.mjs';

    if(fs.existsSync(cfg_sample_file)) {
      throw `${cfg_sample_file} già presente`;
    }


    let default_params = fs.readFileSync(__dirname + 'src/defaults.mjs', 'UTF8');
    const start_string = '/*** INIT START ***/',
      end_string = '/*** INIT END ***/';

    default_params = default_params.substring(
      default_params.indexOf(start_string) + start_string.length, //from
      default_params.indexOf(end_string)
    );

    fs.writeFileSync(
      cfg_sample_file,
      'const params = [{\n' +
      default_params +
      '\n}];\n\n' +
      'export default params;'
    );

    console.log( chalk.bgGreen.bold( ' ** File di configurazione di esempio generato ** ' ) );

  } else {

    let params = {};
    const dir_param_idx = process.argv.findIndex(el => /^--dir/.test(el) );

    if(dir_param_idx !== -1) {
      [, params.work_dir] = process.argv[dir_param_idx].split('=');

    } else {
      params.work_dir = './';
    }

    if(fs.existsSync(path.resolve(params.work_dir, cfg_filename))) {

      import(path.resolve(params.work_dir, cfg_filename))
        .then((custom_params) => {

          if(Array.isArray(custom_params.default)) {

            custom_params.default.forEach(item => {
              createFavicons({ ...defaults, ...params, ...item });
            });

          } else {
            createFavicons({ ...defaults, ...params, ...custom_params.default });
          }
        });

    } else if(fs.existsSync(path.resolve(params.work_dir, defaults.src_img))) {

      createFavicons({...defaults, ...params});

    } else {

      throw `'${cfg_filename}' e '${defaults.src_img}' non presenti`;
    }

  }



} catch(err) {
  console.error(chalk.bgRed(` ${err} `));
}
