/* eslint-disable no-console */
import chalk from 'chalk';

export function printFrame(stringsArray, frameColor = 'success') {

  /*
    stringsArray = [
      {string: '__string__', color: 'success', bg: false},
      {...}
    ]
  */

  // TODO bold underline ecc...

  const string_defaults = { string: '', color: 'success', bg: false, bold: false, underline: false},
    colors = {
      success: ['green', 'bgGreen']
    };

  stringsArray = stringsArray.map(item => {return {...string_defaults, ...item }; });

  const total_length = Math.max( ...(stringsArray.map(item => item.string.length)) ) + 2;

  console.log( chalk[colors[frameColor][0]]( '\n╔' + '═'.repeat(total_length) + '╗') );

  stringsArray.forEach(item => {
    const color = colors[item.color][item.bg? 1 : 0];

    console.log( chalk[color](
      '║ ' + item.string  + ' '.repeat(total_length - item.string.length - 2) + ' ║'
    ));
  });

  console.log( chalk[colors[frameColor][0]]( '╚' + '═'.repeat(total_length) + '╝\n' ) );
}
