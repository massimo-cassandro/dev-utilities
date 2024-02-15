/* eslint-disable no-console */
/* eslint-env node */

import chalk from 'chalk';
import { packages_list } from './list.mjs';

packages_list.forEach(p => {

  console.log(chalk.yellow(`# ${p.label}`));
  console.log(chalk.green(`npm i ${p.dev? '-D' : '-S'} ${p.packages.join(' ')}`));
  console.log('');
});
