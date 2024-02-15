/* eslint-disable no-console */

import { copyFileSync }from 'fs';
import { copyFile as copyFilePromise, constants as copyFileConstant } from 'node:fs/promises';
import * as path from 'path';
import confirm from '@inquirer/confirm';
import checkbox/* , { Separator }  */from '@inquirer/checkbox';
import chalk from 'chalk';
import { URL } from 'url';

import { files } from './copyfiles-list.mjs';


async function executeCopy(source, targetDir, targetFile) {

  const targetPath = targetDir + targetFile;

  try {
    await copyFilePromise(source, targetPath, copyFileConstant.COPYFILE_EXCL);
  } catch {
    const overwrite = await confirm({ message: `Il file '${targetFile}' esiste, sovascrivo?`, default: false});

    if(overwrite) {
      copyFileSync(source, targetPath);
      console.log(chalk.cyan(`File '${targetFile}' copiato`));

    } else {
      console.log(chalk.yellow(`Il file '${targetFile}' è stato saltato`));
    }
  }
}

async function copyfiles(filesToCopy, targetDir) {

  const __dirname = new URL('.', import.meta.url).pathname;

  const sourceDir = path.resolve( __dirname, '../../../dev-files-templates');
  targetDir += /\/$/.test(targetDir)? '' : '/';

  for (const filesToCopyItem of filesToCopy) {

    for (const item of files[filesToCopyItem]) {

      await executeCopy(path.join( sourceDir, item.source), targetDir, item.target);
      console.log();

    } // end for
  } // end for


} // end copyfiles


export async function runCopyFiles(targetDir) {

  const copyFilesList = await checkbox({
    message: 'Scegli quali file aggiungere al progetto:',
    loop: false,
    pageSize: 20,
    choices: Object.keys(files).map((item) => {
      return { value: item, name: `Aggiungi '${item}'` };
    }),

    required: false,
  });

  if(copyFilesList.length ) {

    console.log('\n' + chalk.yellow.inverse(' Copia files in corso... ') + '\n');
    await copyfiles(copyFilesList, targetDir);
    console.log('\n' + chalk.green.inverse(' Copia files completata ') + '\n');

  } else {
    console.log('\n' + chalk.yellow.inverse(' Installazione cancellata ' + '\n'));
  }
}
