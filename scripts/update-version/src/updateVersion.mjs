import { params } from './params.mjs';

export function updateVersion(mode) {

  if(mode === 'major') {
    params.versionArray[0]++;
    params.versionArray[1] = 0;
    params.versionArray[2] = 0;

  } else if(mode === 'minor') {
    params.versionArray[1]++;
    params.versionArray[2] = 0;

  } else if( mode === 'patch') {
    params.versionArray[2]++;
  }

  params.newVersion = params.versionArray.join('.');
}
