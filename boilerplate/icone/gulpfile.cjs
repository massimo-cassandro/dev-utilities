/* eslint-env node */
// gulpfile icone

const gulp = require('gulp')
  //,del = require('del')
  ,beautify = require('gulp-jsbeautifier')
  ,replace = require('gulp-replace')
  ,rename = require('gulp-rename')
  // ,chmod = require('gulp-chmod')
  ,svgstore = require('gulp-svgstore')
  ,svgmin = require('gulp-svgmin')
  //,addsrc = require('gulp-add-src')
  ,concat = require('gulp-concat')
  ,inject = require('gulp-inject-string')
  ,flatmap = require('gulp-flatmap')
  ,fs = require('fs')
  ,dom  = require('gulp-dom')
  ,wrap = require('gulp-wrap')
  // ,grst = require('gulp-remove-svg-tag')
;


let icons_list = []; // lista delle icone, utilizzate per il file demo

const svg_files_folder = 'svg-files',
  svg_files_prefix = '',
  dest_folder = '../../AppBundle/Resources/public/imgs/',
  components_source_folder = './svg-files-dashboard',
  components_extra_icons = [ // eventuali icone dell'altro set da elaborare anche come componenti
    `${svg_files_folder}/ui-info.svg`,
    `${svg_files_folder}/ui-errore.svg`,
    `${svg_files_folder}/ui-success.svg`,
  ],
  components_dest_folder = '../../react-src/icon-components',
  components_dest_src_folder = 'src', // all'interno di components_dest_folder
  components_remove_strings = ['ui-'],
  components_file = 'icons.jsx', // all'interno di components_dest_folder
  output_file = 'icone-ada.svg',
  icons_list_file = 'icon-list.mjs',
  tpl_demo_file = './tpl/demo-icone-tpl.html',
  svg_to_scss = ['freccia', 'ui-errore', 'ui-info', 'ui-success', 'ui-avviso', 'ada-icona'], // icone da convertire in variabili scss
  icons_scss_file = '_icone-svg.scss',

  // https://github.com/svg/svgo/tree/master/plugins
  // https://github.com/svg/svgo#built-in-plugins
  svgmin_plugins = [
    { name: 'cleanupIDs', params: { remove: true, minify: true } }
    , 'removeDoctype'
    , 'removeComments'
    , 'removeTitle'
    , 'removeDimensions'
    , 'collapseGroups'
    , { name: 'cleanupNumericValues', params: { floatPrecision: 4  } }
    , { name: 'convertColors', params: { names2hex: true, rgb2hex: true } }
    , 'removeStyleElement'
    , 'removeEmptyContainers'
    // , { name: 'removeAttrs', params: { attrs: ['(fill|stroke|class|style|data.*)', 'svg:(width|height)'] } }
    // , { name: 'removeAttrs', params: { attrs: ['(filter|fill|stroke|class|style|data.*)', 'svg:(width|height)'] } }
    , { name: 'removeAttrs', params: { attrs: ['(filter|fill|stroke|fill-rule|stroke-linecap|stroke-linejoin|stroke-width|transform|style|class|data.*)', 'svg:(width|height)'] } }
    , 'removeUselessDefs'
    //, { name: 'addAttributesToSVGElement0, params: {attribute: "#{$attr}"}}
    // , { name: 'addClassesToSVGElement', params: { className: 'line-icon'  } }
  ]
;

gulp.task('icone', function() {

  return gulp.src([
    svg_files_folder + '/*.svg',
    '!' + svg_files_folder + '/' + svg_files_prefix + '@*.svg'
  ])
    .pipe(rename(function (path) {
      if(svg_files_prefix) {
        path.basename = path.basename.replace(svg_files_prefix, '');
      }

      // if(/-line$/.test(path.basename)) {
      //   path.basename = path.basename.replace(/-line$/, '');
      //   line_icons.push(path.basename);
      // }
      icons_list.push(path.basename);

      return path;
    }))
    // .pipe(grst({
    //   tagNames: ['filter']
    // }))
    .pipe(svgmin({
      multipass: true,
      full: true,
      plugins: svgmin_plugins
      /* .concat(is_line_icon ? [
          { name: 'addClassesToSVGElement', params: { className: 'line-icon'  } }
        ] : []) */
      //,js2svg: { pretty: true, indent: 2 }
    }))
    //.pipe(addsrc(['icone/icona_da_non_minificare.svg']))
    .pipe(svgstore())
    // .pipe( replace(/id="(.*?)-line"/g, 'id="$1" class="line-icon"') )
    // .pipe( replace(/<title>(.*?)<\/title>/g, '') )
    .pipe( rename(output_file) )
    // .pipe(chmod(0o755))
    .pipe(gulp.dest(dest_folder));

  // copia nella dir di sviluppo per facilitare il debug
  // .pipe( rename(output_file.replace(/\.svg$/, '-copy.svg')) )
  // .pipe(gulp.dest('./'));
});


gulp.task('icons_list', function(cb) {
  var str = '// lista id icone per demo e altro\n' +
    '// NB: questo file è generato dinamicamente, eventuali modifiche saranno sovrascritte.\n\n' +
    '// NB: questo file non è utilizzato nella demo, viene generato solo a scopo di controllo\n' +
    '//     o per eventuali altri utilizzi nel progetto.\n\n' +
    'export const icons_list = ' + JSON.stringify(icons_list.sort(), null, '  ').replace(/"/g, '\'') + ';';

  //str +=  '\n\nexport default icons_list;';

  return fs.writeFile(icons_list_file, str, cb);
});

// creazione file html standalone per la consultazione
// la lista e il codice svg viene incorporato nel file html in modo
// che sia consultabile anche col protocollo `file:///`
gulp.task('demo_file', function() {
  const icone = fs.readFileSync(dest_folder + output_file, 'utf8');
  return gulp.src(tpl_demo_file)
    .pipe(inject.prepend(
      '<!--\n' +
      '  NB: questo file è stato generato dinamicamente, eventuali modifiche saranno sovrascritte \n' +
      `  Se necessario, modificare il file template (${tpl_demo_file})\n`+
      '-->\n'
    ))
    .pipe(dom(function(){
      const wrapper = this.querySelector('.icon-wrapper');
      wrapper.insertAdjacentHTML('afterend',
        `<script>const icons_list = ${JSON.stringify(icons_list.sort(), null, '  ').replace(/"/g, '\'')};</script>`
      );
      return this.body.insertAdjacentHTML('beforeend',
        `<div hidden>${icone}</div>`
      );
    }))
    .pipe(beautify({
      indent_size: 2,
      html: {
        'indent_char': ' ',
        'indent_size': 2,
        'inline': [],
        'wrap_line_length': 0
      }
    }))
    .pipe( rename('demo-icone.html') )
    .pipe(gulp.dest('./'));
});

gulp.task('svg2scss', function () {
  var intro_str = '// icone svg per inclusione nei scss\n' +
      '// NB: questo file è generato dinamicamente, eventuali modifiche saranno sovrascritte\n\n';

  let src_list = [];
  svg_to_scss.forEach(icon => {
    src_list.push(svg_files_folder + '/' + svg_files_prefix + icon + '.svg');
  });

  return gulp.src(src_list)
    .pipe(flatmap(function(stream , file){
      var icon_name = file.path.replace(/^\/(.+\/)*(.+)\.(.+)$/, '$2')
        // .replace(/-line$/, '')
        .replace(svg_files_prefix, '');

      return stream
        .pipe(svgmin(function () {
          return {
            // https://github.com/svg/svgo/tree/master/plugins
            full: true,
            plugins: svgmin_plugins
            //,js2svg: { pretty: true }
          };
        })) // end svgmin
        .pipe(inject.wrap('$icon-' + icon_name + ': \'', '\';'));

    })) // end flatmap
    .pipe(concat( icons_scss_file ))
    .pipe(inject.prepend( intro_str ))
    // .pipe(chmod(0o755))
    .pipe(gulp.dest('./'));
});

let icons_component_list = [], // per il componente che aggrega tutte le esportazioni
  is_fill_icon = false, aspect_ratio = null, viewbox = null;

const component_tpl = `import BaseIcon from '../base-icon';

export default function (props) {
  return (
    <BaseIcon {...props}@extra_props@>
      <%= contents %>
    </BaseIcon>
  );
}`;
gulp.task('icons_components', function () {
  return gulp.src([
    components_source_folder + '/*.svg'
  ].concat(components_extra_icons))
    .pipe(svgmin({
      multipass: true,
      full: true,
      plugins: svgmin_plugins
      /* .concat(is_line_icon ? [
          { name: 'addClassesToSVGElement', params: { className: 'line-icon'  } }
        ] : []) */
      //,js2svg: { pretty: true, indent: 2 }
    }))
    .pipe(rename(function (path) {
      is_fill_icon = /-fill($|-)/.test(path.basename);
      path.basename = path.basename.replace('-fill', '');

      aspect_ratio = null;
      path.basename = path.basename.replace(/-r\d+x\d+($|-)/, (match) => {
        if(match) {
          aspect_ratio = match.replace(/^-r/, '');
        }
        return '';
      });


      components_remove_strings.forEach(str => {
        path.basename = path.basename.replace(str, '');
      });
      icons_component_list.push(path.basename);
      path.basename = 'icon-' + path.basename;
      path.extname = '.jsx';
    }))
    .pipe(replace(/viewBox=('|")((\d+ ?){4})('|")/, (match, p1, p2) => {
      viewbox = null;
      if(aspect_ratio && p2) {
        viewbox = p2;
      }
      return '';
    }))
    .pipe(replace(/<\/?svg(.*?)>/g, ''))
    // .pipe(wrap({ src: './icon-components-template.jsx'}))
    .pipe(wrap(component_tpl))
    .pipe(replace('@extra_props@', () => {
      let extra_props = [
        ...(is_fill_icon ? ['fillIcon={true}'] : []),
        ...(aspect_ratio ? [`ratio='ratio${aspect_ratio}'`] : []),
        ...(viewbox ? [`viewBox='${viewbox}'`] : []),
      ];
      if(extra_props.length) {
        return ` ${extra_props.join(' ')}`;
      } else {
        return '';
      }
    } ))
    .pipe(gulp.dest(components_dest_folder + '/' + components_dest_src_folder));
});

gulp.task('icons_component_main', function(cb) {

  return fs.writeFile(components_dest_folder + '/' + components_file,
    '/* GENERATED FILE */\n\n' +
    icons_component_list.map(item => {

      let module_name = (item.charAt(0).toUpperCase() + item.substr(1))
        .replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

      return `export { default as ${'Icona' + module_name} } from './${components_dest_src_folder}/icon-${item}.jsx';`;
    }).join('\n'),
    cb);
});

gulp.task('default',
  gulp.series(
    // 'icone',
    gulp.parallel(
      'icone',
      'icons_components'
    ),
    gulp.parallel(
      'icons_list',
      'icons_component_main',
      'svg2scss',
      'demo_file'
    )
  )
);
