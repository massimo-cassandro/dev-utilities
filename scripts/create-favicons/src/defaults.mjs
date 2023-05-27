/* eslint-env node */

// tutti i percorsi sono relativi alla dir di lavoro
export const defaults = {

  // immagine sorgent. SVG o PNG 512x512
  src_img: 'favicon-src.svg',

  // sorgente opzionale per immagine piccole (32px)
  small_src_img: null,

  // linguaggio da utilizzare per lo snippet html
  // html, pug o twig
  snippet_language: 'html',

  // nome del file snippet senza estensione
  snippet_name: 'favicon',

  // path dei file favkicon da utilizzare nello snippet
  publicPath: '/',

  // se true aggiunge allo snippet una query string per ovviare ad eventuali
  // problemi di caching del browser
  add_cache_buster: false,

  // directory output (percorso relatuvo alla dir di lavoro)
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

};