/* eslint-env node */
/* eslint-disable no-console */

// converione prima versione changelog.json in txt

import * as fs from 'fs';

const log_file = './changelog.txt';

fs.copyFileSync(log_file, log_file + '.bck');



let file_content = fs.readFileSync(log_file, 'utf8');
const new_log = file_content.trimEnd().split('\n')
  .map(row => {
    const r = row.split('|');
    return `${r[1]}|${r[0]}|${r[2]}`;
  }).join('\n') + '\n';

console.log(new_log);

fs.writeFileSync(log_file, new_log);


console.log('END');
