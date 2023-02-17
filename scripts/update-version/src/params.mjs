/* eslint-env node */
/* eslint-disable no-console */

export const params = {
  packageJsonFile: './package.json',
  logFile: './changelog.txt',

  // chiave proprietà nel file di configurazione
  configProperty: 'updateVersion',

  // defaults configurazione
  cfgDefaults: {
    twigVarsFile     : null,
    htmlFiles        : null,
    skipDescrPrompt  : false,
    patchOnly        : false,
    defaultDescr     : null
  },

  preRealeaseTags: ['alpha', 'beta', 'rc'],

  // parametri elaborati
  cfg                 : {}, // oggetto config elaborato
  packageJsonContent  : {}, // viene impostato con l'oggetto ricavato da package.json
  preRelease          : false, // se prerelease viene impostato con il valore del tag relativo
  oldVersion          : null, // versione originale
  versionArray        : [], // array con i componenti della versione
  newVersion          : null // versione aggiornata
};
