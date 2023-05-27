/* eslint-disable no-console */

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

import sharp from 'sharp';
import toIco from 'to-ico';
import { optimize } from 'svgo';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';


export function createFavicons(params) {

  try {

    const output_dir = path.resolve(params.work_dir, params.output_dir);

    if (!fs.existsSync(output_dir)){
      fs.mkdirSync(output_dir);
    }


    // https://sharp.pixelplumbing.com/api-constructor
    Promise.all([
      ['apple-touch-icon.png', 180],
      ['icon-192.png', 192],
      ['icon-512.png', 512]
    ].map(size => {
      sharp(path.resolve(params.work_dir, params.src_img))
        .resize({ width: size[1], fit: 'inside' })
        .png()
        // .then(info => console.log(info))
        // .toFile(`${output_dir}/${size[0]}`)
        .toBuffer()
        .then(bufferData => {

          // ottimizzazione PNG / JPG
          // https://github.com/imagemin/imagemin
          // https://github.com/imagemin/imagemin-pngquant
          // https://github.com/imagemin/imagemin-jpegtran
          // https://web.dev/use-imagemin-to-compress-images/

          imagemin.buffer(bufferData, {
            plugins: [
              imageminJpegtran(),
              imageminPngquant({
                quality: [0.3, 0.6],
                dithering: false,
                strip: true,
                verbose: true
              })
            ]
          }).then( result => {
            fs.writeFileSync(`${output_dir}/${size[0]}`, result);
          });

        })
        .catch(err => { throw err; });

    }));

    // favicon.ico
    // https://github.com/kevva/to-ico
    // alternativa: https://github.com/steambap/png-to-ico

    // const ico_source = fs.readFileSync(`${output_dir}/apple-touch-icon.png`);

    sharp(path.resolve(params.work_dir, params.small_src_img?? params.src_img))
      .png()
      // .then(info => console.log(info))
      .toBuffer()
      .then(bufferData => {

        toIco([bufferData], {
          sizes: [16, 32],
          resize: true
        }).then( result => {
          fs.writeFileSync(`${output_dir}/favicon.ico`, result);
        });

      })
      .catch(err => { throw err; });


    // favicon.svg (SVGO)
    // TODO add extra config ???
    const svgString = fs.readFileSync(path.resolve(params.work_dir, params.small_src_img?? params.src_img), 'utf8');
    const svg_result = optimize(svgString, {
      multipass: true,
    });
    fs.writeFileSync(`${output_dir}/favicon.svg`, svg_result.data, {force: true});

    // web manifest
    const manifest = {
      icons: [192, 512].map( size => {
        return { src: `./icon-${size}.png`, type: 'image/png', sizes: `${size}x${size}` };
      }),
      ...(params.webmanifest_extra?? {})
    };

    fs.writeFileSync(`${output_dir}/manifest.webmanifest`, JSON.stringify(manifest, null, ' '));


    // snippet
    params.snippet_language = params.snippet_language.toLowerCase();
    const cache_buster = params.add_cache_buster? `?_=${Date.now()}` : '';

    let snippet_content = `<link rel="icon" href="${params.publicPath}favicon.ico${cache_buster}" sizes="any">\n` +
      `<link rel="icon" href="${params.publicPath}icon.svg${cache_buster}" type="image/svg+xml">\n` +
      `<link rel="apple-touch-icon" href="${params.publicPath}apple-touch-icon.png${cache_buster}">\n` +
      `<link rel="manifest" href="${params.publicPath}manifest.webmanifest${cache_buster}">`;

    if(params.snippet_language === 'twig') {
      snippet_content = snippet_content.replace(/href="(.*?)"/g, 'href="{{ asset(\'$1\') }}"');

    } else if (params.snippet_language === 'pug') {
      snippet_content = snippet_content.replace(/<link (.*?)>/g, 'link($1)');
    }


    fs.writeFileSync(
      `${output_dir}/${params.snippet_name}.${params.snippet_language === 'twig'? 'html.twig' : params.snippet_language}`,
      snippet_content
    );


    console.log( chalk.bgGreen.bold( ' ** Creazione favicons completata ** ' ) );
    console.log( chalk.green( `\nI file generati sono nella directory\n'${output_dir}'\n` ) );

  } catch(err) {

    console.error(chalk.bgRed(` ${err} `));
  }

}
