/* eslint-env node */
/* eslint-disable no-console */

// converione prima versione changelog.json in txt

import * as fs from 'fs';

const old_log_file = './changelog.json',
  new_log_file = './changelog.txt';



let txt_exists = false;

if(fs.existsSync(new_log_file)) {
  console.error(new_log_file + ' exists!');

  txt_exists = true;
}

if(!txt_exists) {
  let file_content = JSON.parse(fs.readFileSync(old_log_file, 'utf8'));

  file_content.sort((a,b) => {
    if(a.date > b.date) return 1;
    if(a.date < b.date) return -1;
    return 0;
  });

  console.log(file_content);

  fs.writeFileSync(new_log_file, file_content.map(item => {
    return (' '.repeat(10) + item.vers).slice(-8) + ' | ' +
      item.date + ' | ' +
      (item.descr != null? item.descr : '');
  }).join('\n'));
}

console.log('END');
