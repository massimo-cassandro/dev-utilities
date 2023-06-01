// rimuove la porzione homedir da un path e la sotituisce con '~'

import {homedir} from 'os';

export function remove_homedir(path) {
  const homeDirRegex = new RegExp('^' + homedir());

  return path.replace(homeDirRegex, '~');
}
