# Dev Utilities

Utilità per lo sviluppo


* [Update version](docs/update-version.md)
* [Update packages](docs/update-packages.md)
* [Custom properties list for VSCode](docs/custom-properties-list.md)
* [Create Favicons](docs/create-favicons.md)
* [Esempi di utilizzo](docs/esempi-utilizzo.md)


## TODO

### Update Version
* opzione init per creare il file cfg (condivisa con tutti gli script che ne fanno uso)
* opzione per non aggiornare html e twig ma solo package.json, anche se configurati
* https://github.com/natemoo-re/clack

### vscode custom properties list
* icon list
* jsonc support: https://github.com/microsoft/node-jsonc-parser https://www.npmjs.com/package/comment-json

### setup init
* inizializza un progetto, installa i package std, inizializza npm e git, aggiunge script e setup vari nel package.json

###  create favicons
* percorso specifico per snippet
* possibilità che il file src sia un PNG o JPG
* template per snippet

vedi:

```twig
{% set favicon_path = 'favicons' ~ (app.environment != 'prod'? '-test' : '') ~ '/' %}

<link rel="icon" href="{{ asset(favicon_path ~ 'favicon.ico') }}?_1685367770751=" sizes="any">
<link rel="icon" href="{{ asset(favicon_path ~ 'favicon.svg') }}?_1685367770751" type="image/svg+xml">
<link rel="apple-touch-icon" href="{{ asset(favicon_path ~ 'apple-touch-icon.png') }}?_1685367770751">
<link rel="manifest" href="{{ asset(favicon_path ~ 'manifest.webmanifest') }}?_1685367770751">

```
