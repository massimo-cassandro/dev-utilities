/* eslint-disable no-console */
/* eslint-env node */

// https://github.com/chalk/chalk
// https://github.com/SBoudrias/Inquirer.js#inquirer

import confirm from '@inquirer/confirm';

// import { setTimeout as sleep } from 'node:timers/promises';
import chalk from 'chalk';
// import * as fs from 'fs';
// import * as path from 'path';
// import { URL } from 'url';

import { runCopyFiles } from './src/copyfiles.mjs';
import { createPackageJson } from './src/create-package-json.mjs';


async function main() {
  console.clear();

  const targetDir = process.cwd();

  // console.log();
  console.log(chalk.blue.inverse(' dev-installer '));
  console.log('\nI file verranno copiati nella dir:\n' + chalk.yellow(targetDir)+ '\n\n');

  const runInst = await confirm({ message: 'Proseguo?' });

  if(runInst) {

    const packageJson = await confirm({ message: 'Creo package.json?' });

    if(packageJson) {
      await createPackageJson(targetDir);
    }

    await runCopyFiles(targetDir);

    console.log('\n\n' + chalk.green.inverse(' FINE '));

  } else {

    throw 'Installazione annullata';
  }
}

main().catch(chalk.red(console.error));
