export const defaults = {

  // delimitazione porzione da copiare nel file init
  /*** INIT START ***/

  // tutti i percorsi sono relativi alla dir di lavoro

  // immagine sorgente SVG o PNG 512x512
  src_img: 'favicon-src.svg',

  // sorgente opzionale per immagini piccole (32px)
  small_src_img: null,

  // nome del file snippet senza estensione
  // se null, lo snippet non viene generato
  snippet_name: 'favicon',

  // linguaggio da utilizzare per lo snippet html
  // html, pug o twig
  snippet_language: 'html',

  // path dei file favicon da utilizzare nello snippet
  publicPath: '/',

  // se true aggiunge allo snippet una query string per ovviare ad eventuali
  // problemi di caching del browser
  add_cache_buster: false,

  // directory output (percorso relativo alla dir di lavoro)
  output_dir: 'favicons-output',

  // chiavi aggiuntive per webmanifest, normalmente non necessarie per il browser
  //esempio:
  // vedi https://developer.mozilla.org/en-US/docs/Web/Manifest
  // webmanifest_extra: {
  //   name: "my Application",
  //   short_name: "my app",
  //   background_color: "#ffffff",
  //   theme_color: "#ffffff",
  //   display: "fullscreen"
  // }
  webmanifest_extra: null

  /*** INIT END ***/

};
