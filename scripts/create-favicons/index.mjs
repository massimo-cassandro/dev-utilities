/* eslint-disable no-console */
/* eslint-env node */

// create favicons files as in
// https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs (2023 vers.)


import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

import { createFavicons } from './src/create-favicons.mjs';
import { defaults } from './src/defaults.mjs';

// nome del file di configurazione, se utilizzato
const cfg_filename = 'create-favicons-cfg.mjs';

try {
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
        createFavicons({ ...defaults, ...params, ...custom_params.default });
      });

  } else if(fs.existsSync(path.resolve(params.work_dir, defaults.src_img))) {

    createFavicons({...defaults, ...params});

  } else {

    throw `'${cfg_filename}' e '${defaults.src_img}' non presenti`;
  }


} catch(err) {
  console.error(chalk.bgRed(` ${err} `));
}
