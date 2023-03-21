# Dev Utilities

Utilità per lo sviluppo

## Update version

Legge la versione registrata in `package.json` e la aggiorna. Opzionalmente aggiorna anche altri file legati al numero di versione.

Ogni aggiornamento aggiunge una riga al file `changelog.txt` posizionato sulla root del progetto. Ogni riga contiene la data, la versione aggiornata  e opzionalmente un testo descrittivo.

Il numero di versione aggiornato e il testo descrittivo vengono copiati nella clipboard per velocizzare l'inserimento dei commenti dell'eventuale commit successivo. 

A partire dalla versione 1.9.x sono gestite anche le versioni di pre-release `alpha`, `beta` e `rc`. Se viene scelto di aggiungere un tag di pre-release si potrà scegliere di associarlo alla *major* o alla *minor version*, mentre la *patch version* viene impostata a `0`.

Se un tag pre-release viene rilevato nella versione corrente, si può scegliere, se aggiornarlo, cambiarlo con altro tag (resettando la versione pre-release a `0`) o eliminarlo del tutto.

Utilizzo:

```bash
npx update-version --config=./dev-utilities.config.mjs
```

In cui  `--config=<path>` indica il percorso al file `.mjs` di configurazione generale (vedi sotto). Il file deve esportare un oggetto con la proprietà `updateVersion`. Se il path non viene specificato, il percorso di default è `./dev-utilities.config.mjs`.

La proprietà `updateVersion` può contenere:

```javascript
const config = {
  updateVersion: {
     
    /*
      percorso al file twig che contiene l'array di variabili globali  `glob_vars` che contiene a sua volta l'elemento `vers` che viene impostato col valore assegnato alla proprietà `version` di `packege.json`
      (default null)
    */
    twigVarsFile: 'path/to/file/config.html.twig',

    /*
      cerca la stringa `(?|&)(_|v)=1.2.3(-\d+)` associata ai tag che richiamano file js o css all'interno dei file html specificati e aggiorna il numero di versione
      (default null)
    */
    htmlFiles: ['path/to/html_file1.html', 'path/to/html_file2', ...],

    /*
      testo descrittivo di default mostrato tra le opzioni di aggiornamento
      (default null)
    */
    defaultDescr: 'text',

    /*
      se impostato su `true` non viene mostrato il prompt con la richiesta del testo descrittivo (default false). 
      Questa impostazione può essere sovrascritta dalla presenza del parametro CLI `--skip-descr-prompt`
    */
    skipDescrPrompt: true | false,

    /*
      fa in modo che sia aggiornata direttamente la patch  version saltando l'opzione di scelta relativa (default false). 
      Questa impostazione può essere sovrascritta dalla presenza del parametro CLI `--patch-only`
    */
    patchOnly: true | false

  }
}
```

Tutti parametri sono opzionali

### Parametri CLI
Opzionalmente, e per compatibilità con le versioni precedenti, alcuni parametri possono essere definiti direttamente via CLI:

```bash
node ./node_modules/@massimo-cassandro/dev-utilities/scripts/update-version.mjs \ 
  --html-files=path/to/html_file1.html,path/to/html_file2.html,... \
  --twig-vars-file=path/to/file/config.html.twig \
  --default-descr=text \
  --skip-descr-prompt \
  --patch-only
```

I parametri 

* `--twig-vars-file`
* `--html-files`
* `--default-descr`

vengono ignorati se il parametro `--config` è presente, mentre i parametri 

* `--patch-only`
* `--skip-descr-prompt`

se presenti, prevalgono sulle eventuali impostazioni presenti nel file di configurazione


## Update packages

Esegue `npm update` per tutti i packeges installati all'interno di `node_modules/@massimo-cassandro`.

```bash
npx upd@m
```


## custom properties list

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



## Esempi e file di configurazione

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
     "upd@m": "npx updd@m",
     "build vscode props list": "npx vscode-css-properties-list --config=./dev-utilities.config.mjs",
  }
}

```

## TODO

### Update Version
* opzione per non aggiornare html e twig ma solo package.json
* https://github.com/natemoo-re/clack

### vscode custom properties list
* icon list
* jsonc support: https://github.com/microsoft/node-jsonc-parser https://www.npmjs.com/package/comment-json

### setup init
* inizializza un progetto, installa i package std, inizializza npm e git, aggiunge script e setup vari nel package.json
