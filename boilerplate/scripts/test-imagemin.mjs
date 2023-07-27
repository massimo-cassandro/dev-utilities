import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

// import * as fs from 'fs';

// ottimizzazione PNG / JPG
// https://github.com/imagemin/imagemin
// https://github.com/imagemin/imagemin-pngquant
// https://github.com/imagemin/imagemin-jpegtran
// https://web.dev/use-imagemin-to-compress-images/

const dir = './favicons-output';

imagemin([`${dir}/*.{jpg,png,jpeg}`], {
  destination: dir + '/build',
  plugins: [
    imageminJpegtran(),
    imageminPngquant({
      quality: [0.4, 0.8],
      dithering: false,
      strip: true,
      verbose: true
    })
  ]
});
