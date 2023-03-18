#!/usr/bin/env node

/* eslint-disable no-console */
/* eslint-env node */

// run npm update for all packeges inside `node_modules/@massimo-cassandro` folder

import * as fs from 'fs';
import chalk from 'chalk';
import {execSync} from 'child_process';


const folder = './node_modules/@massimo-cassandro',
  packages = [];

try {

  if(!fs.existsSync(folder)) {
    throw `\n-------------\n${folder} non presente.\n--------------\n`;
  }

  fs.readdirSync(folder).forEach(item => {
    let stats = fs.statSync(`${folder}/${item}`); // stats.isFile() / stats.isDirectory()
    if(stats.isDirectory()) {

      const packageJsonFile = `${folder}/${item}/package.json`;

      if(!fs.existsSync(packageJsonFile)) {
        throw `\n-------------\nFile 'package.json' in '${item}' non presente.\n--------------\n`;
      }

      const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8')),
        packageName = packageJsonContent.name;

      packages.push(packageName);
    }
  });

  if(packages.length) {
    execSync(`npm update --save ${packages.join(' ')}`, {stdio: 'inherit'});
  }

  console.log( chalk.green( '\n' + packages.map(i => `  • ${i}`).join('\n') ) );
  console.log( chalk.bgGreen.bold( '\n Aggiornamento completato. \n' ) );

} catch(e) {
  console.error( chalk.red( e ) );
}
