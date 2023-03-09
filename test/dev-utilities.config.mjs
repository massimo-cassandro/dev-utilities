/*
  File di configurazione di `dev-utilities.
  Permette la definizione dei parametri per tutti gli script utilizzati.
  Nessun parametro è obbligatorio, quelli presenti sono i valori di default:
*/
const config = {
  /*
    Configurazione per `update-version`
    Nessun parametro è obbligatorio
  */
  updateVersion: {
    twigVarsFile     : null,   // default null
    htmlFiles        : null,   // default null
    skipDescrPrompt  : false,  // default false
    patchOnly        : false,  // default false
    defaultDescr     : null    // default null
  },

  /*
    Configurazione per `vscode-css-properties-list`
  */
  cssPropsList: {

    sources: [
      './test/vscode-css-custom-properties-list/test.css'
    ],
    snippet_file           : './test/vscode-css-custom-properties-list/myproject.code-snippets',
    result_test_file       : './test/vscode-css-custom-properties-list/css-debug-file.css',
    snippet_key            : 'custom props list',
    custom_var_prefix      : 'prefix-',
    icon_sources: [
      './test/vscode-css-custom-properties-list/icon-list.js'
    ],
    icon_list_snippet_key  : 'icons list'

  }
};

export default config;
