(() => {
  'use strict';

  // grid breakpoints
  /*
  // --bs-breakpoint-xs: 0;
  // --bs-breakpoint-sm: 576px;
  // --bs-breakpoint-md: 768px;
  // --bs-breakpoint-lg: 992px;
  // --bs-breakpoint-xl: 1200px;
  // --bs-breakpoint-xxl: 1400px;

  // https://css-tricks.com/how-to-get-all-custom-properties-on-a-page-in-javascript/
  const bs_custom_properties_list = [...document.styleSheets]
    .filter(s => s.href.indexOf('bootstrap') !== -1)
    .reduce((result, sheet) => result.concat(
      [...sheet.cssRules]
        // [...sheet.cssRules].filter(rule => rule.type === 1) // type deprecato
        .filter(rule => rule.constructor.name === 'CSSStyleRule') // exclude mediaRules, ecc
        .reduce((propValArr, rule) => {
          const props = [...rule.style].map((propName) => [
            propName.trim(),
            rule.style.getPropertyValue(propName).trim()
          ])
            .filter(([propName]) => propName.indexOf('--bs-') === 0);

          return [...propValArr, ...props];
        }, [])
    ), []);


  bs_custom_properties_list.sort((a,b) => {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });
  console.log(bs_custom_properties_list);

  const bs_breakpoints = bs_custom_properties_list.filter(([propName]) => propName.indexOf('--bs-breakpoint-') === 0);
  const bs_gutter_x = bs_custom_properties_list.filter(([propName]) => propName === '--bs-gutter-x');

  console.log(bs_breakpoints);
  console.log(bs_gutter_x); // NB più di uno

  // mancano cmq  i valori di $container-max-widths (bs 5.3)
  */

  const img_base_url = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    img_formats = ['avif', 'webp', 'pjpg'],

    // NB le larghezze corrispondono ai valori della var bootstrap
    // `$container-max-widths`, non accessibile tramite custom properties
    brks= {
      'xxl': {w: 1296, mq_values: [1400, null], dpr2: false},
      'xl':  {w: 1116, mq_values: [1200, 1399], dpr2: false},
      'lg':  {w:  936, mq_values: [ 992, 1199], dpr2: false},
      'md':  {w:  696, mq_values: [ 768,  991], dpr2: true},
      'sm':  {w:  516, mq_values: [ 576,  767], dpr2: true},
      'xs':  {w:  576, mq_values: [null,  575], dpr2: true}
    };



  document.getElementById('picture').innerHTML = Object.keys(brks).map((brk_key, idx) => {

    const is_last_brk = idx === Object.keys(brks).length - 1,
      brk = brks[brk_key];

    return `<!-- ${brk_key} -->\n` +
      img_formats.map(fmt => {
        const is_default_fmt = fmt === img_formats.at(-1);

        const h = brk.w * 3/4,

          base_url = img_base_url +
          '&fit=crop' +
          '&q=60' +
          `&w=${brk.w}` +
          `&h=${h}` +
          `&fm=${fmt}` +

          //debug
          `&txt=${encodeURI(`${brk_key} - ${fmt} ${brk.dpr2? ' 2x' : ''}`)}` +
          '&txt-pad=5' +
          '&txt-font=Arial+Narrow+Bold' +
          '&txt-y=10' +
          '&txt-size=24' +
          '&txt-color=FFFFFF',

          srcset_url = base_url + (brk.dpr2? ` 1x, ${base_url}&dpr=2 2x` : '');

        if(is_last_brk && is_default_fmt) {
          return `<img src="${base_url}"
            ${srcset_url !== base_url? `srcset="${srcset_url}"` : ''}
            class="img-fluid"
            alt="gatto"
            width="${brk.w}"
            height="${h}"
          />`;

        } else {
          return `<source
            srcset="${srcset_url}"
            ${is_default_fmt? '' : `type="image/${fmt}"`}
            media="${brk.mq_values.map((v, idx) => v && `(${idx === 0? 'min' : 'max'}-width: ${v}px)`).filter(v => v).join(' and ')}"
            width="${brk.w}"
            height="${h}"
          />`;
        }
      }).join('\n');

  }).join('\n');
})();
