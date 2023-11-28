/* eslint-disable no-console */
/* eslint-disable quotes */

import * as fs from 'fs';
import * as path from 'path';
import { stat } from 'node:fs';
import confirm from '@inquirer/confirm';
import input from '@inquirer/input';

import chalk from 'chalk';

import { PackageJsonDefaultOpts, packageJsonBuilder } from './create-package-json-builder.mjs';


// TODO merge con file esistente?
// TODO check file già esistente

export async function createPackageJson(targetDir) {

  const packagePath = path.resolve(targetDir, 'package.json'),
    opts = {};
  // console.log(packagePath);

  // stat(packagePath, async (err) => {
  //   if (err) {
  //     console.log(chalk.red('Il file package.json esiste già'));
  //     return;

  //   } else {
  //   }
  // });


  for (const key in PackageJsonDefaultOpts) {

    if(typeof PackageJsonDefaultOpts[key] === 'boolean') {
      const thisOpt = await confirm({
        message: key,
      });

      opts[key] = thisOpt;

    } else {

      const thisTextOpt = await input({
        message: key,
        default: PackageJsonDefaultOpts[key]
      });

      opts[key] = thisTextOpt;
    }
  }

  const packageObj = packageJsonBuilder(opts);
  fs.writeFileSync(packagePath, JSON.stringify(packageObj, null, '  '));
  console.log('\n' + chalk.dim('package.json creato') + '\n');

}
