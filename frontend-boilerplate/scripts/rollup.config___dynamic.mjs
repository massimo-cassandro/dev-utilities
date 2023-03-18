import terser  from '@rollup/plugin-terser';
// import sourcemaps from 'rollup-plugin-sourcemaps';
import fs from 'fs';
import node_resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import p from '../package.json'; // assert { type: 'json' };

const terserOptions = {
    compress: {
      passes: 2
    }
  },
  anno = new Date().getFullYear(),
  dirs = [
    {source_dir: './front-end/js', output_dir: './AppBundle/Resources/public/js'}
  ];

let config = [];

// lettura subdir apps e aggiunta a `dirs`
fs.readdirSync('./front-end/apps').forEach(item => {
  let stats = fs.statSync(`./front-end/apps/${item}`); // stats.isFile() / stats.isDirectory()
  if(stats.isDirectory()) {
    dirs.push({
      source_dir: `./front-end/apps/${item}`,
      output_dir: `./AppBundle/Resources/public/apps/${item}`
    });
  }
});

dirs.forEach(dir => {

  fs.readdirSync(dir.source_dir)
    .filter(f => /\.js$/.test(f))
    .filter(f => /^[^_]/.test(f)) // ignore files starting with _
    .forEach(file => {

      let format = 'iife',
        name = null;

      if(/(-umd\.js)$/.test(file)) {
        format = 'umd';
        name = file.replace('-umd.js', '').replace(/-/g, '_');
      }

      config.push(
        {
          // preserveEntrySignatures: false,
          input: `${dir.source_dir}/${file}`,
          plugins: [
            // sourcemaps(),
            node_resolve(),
            commonjs(),
            terser(terserOptions)
          ],
          output: [{
            file: `${dir.output_dir}/${file.replace('.js', '-min.js')}`,
            format: format,
            sourcemap: true,
            name: name,
            banner: `/*! xxxx v.${p.version} - Massimo Cassandro ${anno} */`,
            footer: `//! Released on ${new Date().toLocaleString('it-IT', {
              year: 'numeric',
              month: 'short',
              day: '2-digit', // 'numeric
              hour12: false,
              hour:'2-digit',
              minute:'2-digit'
            })}`
          }]
        }
      );

    });
});

export default config;