/* eslint-disable no-console */
/* eslint-env node */

import { packages_list } from './list.mjs';
import { writeFileSync } from 'fs';

import * as path from 'path';

// oppure
const __dirname = new URL('.', import.meta.url).pathname;


const target_file = path.resolve(__dirname, '../../dev-files-templates/npm-inst-list.md');

const content = packages_list.map(p => {

  return `## ${p.label}\n` +
    `npm i ${p.dev? '-D' : '-S'} ${p.packages.join(' ')}\n\n`;
}).join('');

writeFileSync(target_file, '# Packages list\n\n' + content);

console.log(`...wrote to ${target_file}`);
