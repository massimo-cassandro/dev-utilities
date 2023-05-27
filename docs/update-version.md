# Update version

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
