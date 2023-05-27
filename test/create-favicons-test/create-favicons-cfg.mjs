const params = {

  // immagine sorgent. SVG o PNG 512x512
  src_img: 'favicon-src.svg',

  // sorgente opzionale per immagine piccole (32px)
  small_src_img: 'favicon-small-src.svg',

  // linguaggio da utilizzare per lo snippet html
  // html, pug o twig
  snippet_language: 'html',

  // se true aggiunge allo snippet una query string per ovviare ad eventuali
  // problemi di caching del browser
  add_cache_buster: true,

  // directory output (percorso relatuvo alla dir di lavoro)
  output_dir: './favicons-output'
};

export default params;
