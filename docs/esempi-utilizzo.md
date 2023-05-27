# Esempi di utilizzo

[toc]

## Esempio file di configurazione

file `dev-utilities.config.mjs`:

```javascript

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
    custom_var_prefix      : ['prefix-'],
    icon_sources: [
      './test/vscode-css-custom-properties-list/icon-list.js'
    ],
    icon_list_snippet_key  : 'icons list'

  }
};

export default config;
```

Nella directory `test` è presente un file di configurazione di prova ed altri esempi.


## Utilizzo nella sezione script del file `package.json`

Esempio di implementazione:

```json
{
  "scripts": {
     "update-version": "npx update-version --config=./dev-utilities.config.mjs",
     "upd@m": "npx upd@m",
     "build vscode props list": "npx vscode-css-properties-list --config=./dev-utilities.config.mjs",
  }
}

```
