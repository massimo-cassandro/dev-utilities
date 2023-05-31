import terser  from '@rollup/plugin-terser';
import node_resolve from '@rollup/plugin-node-resolve';

import json from '@rollup/plugin-json';
import pkg from '../../package.json' assert { type: 'json' };


const terserOptions = {
  compress: {
    passes: 2
  }
};

export default {
  input: './scripts/layout-tools/layout-tools.js',
  plugins: [node_resolve(), terser(terserOptions), json()],

  output: [
    {
      file: './dist/layout-tools-min.js',
      format: 'iife',
      sourcemap: 'inline',
      banner: `/*! @massimo-cassandro/dev-utilities v.${pkg.version} - ` +
        `${new Date().toLocaleString('it-IT', { year: 'numeric', month: 'long' })} */`
    }
  ]
};
