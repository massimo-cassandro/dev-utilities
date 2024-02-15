/* eslint-disable no-console */

import checkbox/* , { Separator }  */from '@inquirer/checkbox';
import chalk from 'chalk';
import { execSync } from 'child_process';

// https://github.com/SBoudrias/Inquirer.js

import { packages_list, defaultPackageValues } from './packages-inst-list.mjs';

export async function packagesInst() {

  const pkgs_idxs = await checkbox({
    message: 'Packages da installare:',
    loop: false,
    pageSize: 20,
    choices: packages_list.map((item, idx) => {
      return {
        value: idx,
        name: item.label + (item.hint? ` (${item.hint})` : '')
      };
    }),

    required: false,
  });

  let devPackages = [], packages = [];

  if(pkgs_idxs.length ) {


    const pkgs = pkgs_idxs.map(idx => {
      return {...defaultPackageValues, ...packages_list[idx]};
    });

    const createPackagesList = (dev = false) => {
      return pkgs.filter(i => i.dev === dev).map(i => {
        let p = i.packages;

        if(i.merge.length) {

          p = [...p, ...i.merge.map(m => packages_list.filter(p => p.id === m)[0]?.packages)];
        }

        return {packages: p.flat().join( ' ' ), label: i.label};
      });
    };

    devPackages = createPackagesList(true);
    packages = createPackagesList(false);

  }

  // console.log(devPackages);
  // console.log(packages);

  const runInst = (label, packages) => {
    console.log(chalk.yellow(`Installazione ${label}`));

    execSync(`npm i -S ${packages}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.error(chalk.red('exec error: ' + error));
      }
    });

  };

  [packages, devPackages].forEach((pkg, idx) => {

    console.log(chalk.yellow.inverse(`\n\n Installazione packages in ${idx === 0? 'dependencies' : 'devDependencies'} `));

    if(pkg.length) {
      for(const item of pkg) {
        runInst(item.label, item.packages);
      }
    } else {
      console.log(`Nulla da installare in ${idx === 0? 'dependencies' : 'devDependencies'}`);
    }
  });


}
