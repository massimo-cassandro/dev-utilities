# Dev Utilities

Utilità per lo sviluppo


* [Update version](docs/update-version.md)
* [Update packages](docs/update-packages.md)
* [Custom properties list for VSCode](docs/custom-properties-list.md)
* [Create Favicons](docs/create-favicons.md)
* [Dev installer](docs/dev-inst.md)
* [Esempi di utilizzo](docs/esempi-utilizzo.md)

## Layout-tools

Inserire nella pagina:

```html
<script src="/path/to/layout-tools-min.js" data-fw="__fw__"></script>
```

`__fw__` corrisponde al framework utilizzato e può essere:

* `bs5`: Bootstrap 5 (default)
* `bs4`: Bootstrap 4
* `bs3`: Bootstrap 3
* `foundation6`: Foundation 6



## TODO
* opzione init per creare il file cfg (condivisa con tutti gli script che ne fanno uso)

### Update Version
* opzione per non aggiornare html e twig ma solo package.json, anche se configurati
* https://github.com/natemoo-re/clack

### vscode custom properties list
* rivedere completamente
* icon list
* migliorare gestione percorsi inseriti nel cfg U(ora sono considerati sempre dalla root del progetto, ma genera equivoci)
* jsonc support: https://github.com/microsoft/node-jsonc-parser https://www.npmjs.com/package/comment-json

### setup init
* inizializza un progetto, installa i package std, inizializza npm e git, aggiunge script e setup vari nel package.json

###  create favicons
* possibilità che il file src sia un PNG o JPG (???)

