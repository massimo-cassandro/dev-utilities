
# custom properties list per VSCode

Estrae dalla lista di file `.css` indicati l'elenco delle *custom properties* e genera uno *snippet vscode*.

Per altre info vedi [A Custom Properties Snippet Builder for VS Code](https://medium.com/me/stats/post/e6f415f2ccd7).

Opzionalmente produce anche uno snippet con un elenco delle icone utilizzate nel progetto. NB: questa funzionalità è estremamente elementare e limitata, al momento, alla presenza di elenchi file icone, tipicamente prodotti da script gulp o simili.

È necessario predisporre preventivamente gli elementi necessari nel file snippet vscode:

```json
{

  "custom props list": {
    "scope": "scss,css,javascript,javascriptreact,js,jsx,styled-css,jsx-attr,html",
    "prefix": ["var("],
    "body": []
  },
  "icons list": {
    "scope": "scss,css,javascript,javascriptreact,js,jsx,styled-css,jsx-attr,html",
    "prefix": ["icon"],
    "body": []
  }
}
```

Utilizzo:

```bash
npx css-properties-list --config=./dev-utilities.config.mjs
```

In cui  `--config=<path>` indica il percorso al file `.mjs` di configurazione generale (vedi sotto). Il file deve esportare un oggetto con la proprietà `cssPropsList`. Se il path non viene specificato, il percorso di default è `./dev-utilities.config.mjs`.

La proprietà `cssPropsList`contiene:

```javascript
const config = {
  cssPropsList: {
    
    /*
      percorso ai file css da analizzare
      deve essere presente almeno un file
    */
    sources: [
      './path/to/file.css'
    ],

    /*
      percorso al file snippets vscode
    */
    snippet_file: './.vscode/myproject.code-snippets',

    /*
      Facoltativo (default null)
      percorso del file css in cui elencare tutte le custom properties rilevate
      Omettere o impostare a `null` per disattivare
    */
    result_test_file: './path/to/css-debug-file.css',

    /*
      chiave della proprietà del file snippets VSCode in cui registare l'elenco delle custom properties
    */
    snippet_key: 'custom properties list',

    /*
      Facoltativo (default null)
      Array di prefissi anteposti ai nomi delle custom properties
      Se si utilizza un solo prefisso è possibile inserirlo come stringa
      (es. --prefix-color: #c00)
      NB: includere sempre il carattere `-` finale
    */
    custom_var_prefix: ['prefix-'],

    /*
      Facoltativo (default null)
      array di percorsi ai file js contenenti l'elenco di icone del progetto.
      Il file deve esportare un array di nomi icone 
      Omettere o impostare a `null` o `[]` per disattivare questa funzionalità

      NB: SUPPORTO LIMITATO A CASI SPECIFICI
    */
    icon_sources: ['./path/to/file.js'],

    /*
      Facoltativo (default null)
      chiave della proprietà del file snippets VSCode in cui registare l'elenco delle icone
      Omettere o impostare a `null` per disattivare questa funzionalità

      NB: SUPPORTO LIMITATO A CASI SPECIFICI
    */
    icon_list_snippet_key: 'icons list'

  }
}
```
