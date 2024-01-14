/* eslint-disable no-console */
/* eslint-disable quotes */

import * as fs from 'fs';
import * as path from 'path';
import confirm from '@inquirer/confirm';
import input from '@inquirer/input';

import chalk from 'chalk';

import { PackageJsonDefaultOpts, packageJsonBuilder } from './create-package-json-builder.mjs';


export async function createPackageJson(targetDir) {

  const packageJsonConfirm = await confirm({ message: 'Creo package.json?', default: true }),
    packagePath = path.resolve(targetDir, 'package.json'),

    buildPackageJson =  async () => {
      const opts = {};

      for (const key in PackageJsonDefaultOpts) {

        if(typeof PackageJsonDefaultOpts[key] === 'boolean') {
          const thisOpt = await confirm({
            message: key,
            default: PackageJsonDefaultOpts[key]
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
      console.log('\n' + chalk.green.inverse(' Il file package.json è stato creato ') + '\n');
    };


  await (async () => {
    if(packageJsonConfirm) {

      await fs.promises.access(packagePath, fs.constants.F_OK)
        .then( () => {
          console.log('\n' + chalk.red.inverse(' Il file package.json esiste già, la sua creazione è stata ignorata ') + '\n');
        })
        .catch(async () => {
          await buildPackageJson();
        });

    } // end if packageJsonConfirm
  })();

}
