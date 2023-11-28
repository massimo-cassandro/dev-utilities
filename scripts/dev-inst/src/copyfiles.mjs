/* eslint-disable no-console */

import * as fs from 'fs';
import * as path from 'path';
import confirm from '@inquirer/confirm';
import checkbox/* , { Separator }  */from '@inquirer/checkbox';
import chalk from 'chalk';
import { URL } from 'url';

import { files } from './copyfiles-list.mjs';


function copyfiles(filesToCopy, targetDir) {

  const __dirname = new URL('.', import.meta.url).pathname;

  const templatesDir = path.resolve( __dirname, '../../../dev-files-templates');
  targetDir += /\/$/.test(targetDir)? '' : '/';

  filesToCopy.forEach(filesToCopyItem => {

    files[filesToCopyItem].forEach(item => {

      console.log(chalk.dim(`Copia del file '${item[1]}'...`));

      const source = path.join( templatesDir, item[0]),
        target = targetDir + item[1];

      // console.log(templatesDir, item[0], source);
      // console.log(targetDir, item[1], target);

      fs.copyFile(source, target, fs.constants.COPYFILE_EXCL, async (err) => {
        console.log();
        if(err?.code === 'EEXIST') {
          console.log('\n' + chalk.red(`il file '${err.dest}' esiste`) + '\n');
          const overwrite = await confirm({ message: `Il file '${err.dest}' esiste, sovascrivo?`});

          if(overwrite) {
            fs.copyFileSync(source, target);
            console.log(chalk.green(`File '${item[1]}'copiato`));

          } else {
            console.log(chalk.yellow(`Il file '${err.dest}' è stato saltato`));
          }

        } // else {
        //   console.log(chalk.green(`File '${item[1]}'copiato`));
        // }
      });
    });

  });
}


export async function runCopyFiles(targetDir) {

  const copyFilesList = await checkbox({
    message: 'Scegli cosa copiare: (spazio per selezionare)',
    loop: false,
    choices: Object.keys(files).map((item) => {
      return { value: item, name: `Aggiungi '${item}'` };
    }),

    required: false,
  });

  if(copyFilesList.length ) {

    console.log('\n' + chalk.yellow.inverse(' Copia files in corso... ') + '\n');
    copyfiles(copyFilesList, targetDir);
    console.log('\n' + chalk.yellow.inverse(' Copia files completata ') + '\n');

  } else {
    console.log('\n' + chalk.yellow.inverse(' Installazione cancellata ' + '\n'));
  }
}
