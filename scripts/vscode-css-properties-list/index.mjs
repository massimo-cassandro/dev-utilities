#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-console */


import getConfig from '../shared/getConfig.mjs';
import {default_params} from './src/default_params.mjs';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

try {

  const cfg_param_index = process.argv.findIndex(el => /^--config/.test(el) ),
    configProperty = 'cssPropsList'; // chiave parametri all'interno del file di configurazione

  let cfgPath = null;
  if(cfg_param_index !== -1) {
    [, cfgPath] = process.argv[cfg_param_index].split('=');
  }

  getConfig(cfgPath, configProperty)
    .then(parsedCfg => {

      if(parsedCfg === false) {
        throw 'Errore nella lettura del file di configurazione';
      }

      const params = {...default_params, ...parsedCfg};
      let custom_properties = [];

      // =>> check
      if(!params.snippet_file) {
        throw 'Parametro `snippet_file` non impostato.';
      }
      if(!fs.existsSync(params.snippet_file)) {
        throw `'${params.snippet_file}' non presente.`;
      }

      params.sources.forEach(css_file => {

        if(!fs.existsSync(css_file)) {
          throw `'${css_file}' non trovato.`;
        }

        let css_content = fs.readFileSync(css_file).toString();

        const regex = new RegExp(`--${params.custom_var_prefix}[a-zA-Z0-9._-]*?: ?(.*?)[;}]`, 'gi'),
          this_cust_props = css_content.match(regex);

        custom_properties = custom_properties.concat(this_cust_props);
      });

      // eliminazione `}` finale
      custom_properties = custom_properties.map(item => item.replace(/}$/, ';'));

      // =>> scrittura test file
      if(params.result_test_file) {
        let custom_properties_file_content = [...new Set(custom_properties)];
        custom_properties_file_content.sort();

        fs.writeFileSync(params.result_test_file,
          '.custom-properties {\n\n' +
          custom_properties_file_content.map(item => `  ${item}`).join('\n') +
          '\n\n}'
        );
      }

      // =>> creazione snippet custiom properties
      custom_properties = custom_properties.map(item => item.split(':')[0].trim());
      custom_properties.sort();
      custom_properties = [...new Set(custom_properties)];

      const vscode_snippet_body = `var(--${params.custom_var_prefix}\${1|` +
        custom_properties.reduce((result,item) => `${result},${item}`).replaceAll(`--${params.custom_var_prefix}`, '') +
        '|})$0';

      // VSCODE snippets reading and update
      let snippets = JSON.parse(fs.readFileSync(params.snippet_file).toString());

      if(!snippets[params.snippet_key]) {
        throw `'${params.snippet_key}' non presente nel file '${params.snippet_file}'`;
      }

      snippets[params.snippet_key].body = [vscode_snippet_body];

      // TODO
      // =>> creazione snippet icone
      // if(params.icon_list_snippet_key && !snippets[params.icon_list_snippet_key]) {
      //   throw `'${params.icon_list_snippet_key}' non presente nel file '${params.snippet_file}'`;
      // }

      // new Promise((resolve) => {

      //   if(params.icon_sources && params.icon_sources.length) {

      //     let snippet_icon_list = [];

      //     params.icon_sources.forEach(icon_file => {

      //       if(!fs.existsSync(icon_file)) {
      //         throw `'${icon_file}' non trovato.`;
      //       }

      //       // TODO NB: al momento è previsto che ogni file icone esporti una variabile `icon_list`
      //       //      corrispondente all'array delle icone presenti nel progetto
      //       (async () => {
      //         const {icon_list} = await import(path.resolve('./', icon_file));
      //         snippet_icon_list = snippet_icon_list.concat(icon_list);
      //         console.log(snippet_icon_list);
      //       })();
      //     });
      //     snippets[params.icon_list_snippet_key].body = ['${1|' + snippet_icon_list.join(',') + '|}$0'];
      //     resolve();

      //   } else {
      //     resolve();
      //   }

      // })
      //   .then(() => {

      //     console.log(snippets);

      // scrittura file snippet
      fs.writeFileSync(params.snippet_file, JSON.stringify(snippets, null, '  '));

      console.log( chalk.bgGreen(' *** File snippet aggiornato *** ') );

      //   });

    }); // end then

} catch(e) {
  console.error(chalk.bgRed(` ${e} `));
}









