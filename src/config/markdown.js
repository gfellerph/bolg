import markdownParser from 'marked';
import { getSrcset, constructThumborUrl } from 'src/config/constants';

const markdownOptions = {
  gfm: true,
  smartypants: true,
};

export const marked = (str, options = {
  lqip: true,
}) => {
  const renderer = new markdownParser.Renderer();
  renderer.image = (href, title, text) => {
    const useLqip = href.indexOf('//adie.bisnaer.ch/') >= 0 && options.lqip;
    let srcset = false;
    let lqipSrc = false;
    let noZoom = false;
    let src = href;
    // Filter self hosted images as well as jpgs and pngs, no gifs
    if (useLqip) {
      /* eslint no-param-reassign: 0 */
      lqipSrc = href;
      noZoom = true;
      src = constructThumborUrl(href, {
        width: 20,
        filters: {
          blur: 2,
        },
      });
      srcset = getSrcset(href);
    }
    const srcAttr = href ? ` src="${src}"` : '';
    const titleAttr = title ? ` title="${title}"` : '';
    const altAttr = text ? ` alt="${text}"` : '';
    const srcsetAttr = srcset ? ` srcset="${srcset}"` : '';
    const lqipSrcsetAttr = srcset ? ` data-lqip-srcset="${srcset}"` : '';
    const lqipSrcAttr = lqipSrc ? ` data-lqip-src="${lqipSrc}"` : '';
    // const sizesAttr = srcset ? ' sizes="(max-width: 640px) 100vw, 640px"' : '';
    const noZoomAttr = noZoom ? ' data-no-zoom' : '';
    if (useLqip) {
      return `
        <div class="lqip__wrapper">
          <img${srcAttr}${titleAttr}${altAttr}${lqipSrcsetAttr}${lqipSrcAttr}${noZoomAttr}>
          <noscript>
            <img src="${href}"${titleAttr}${altAttr}${srcsetAttr}${lqipSrcAttr}>
          </noscript>
        </div>
      `;
    }
    return `<img src="${href}"${titleAttr}${altAttr}${srcsetAttr}${lqipSrcAttr}>`;
  }
  const mergedOptions = Object.assign({}, markdownOptions, options);
  mergedOptions.renderer = renderer;
  return markdownParser(str, mergedOptions);
}

const scriptAndStyleRemover = /<(style|script).*(>[\s\S]*?<\/(style|script)>?|\/>)/gi;

export const excerpt = str => markdownParser(`${str
  .replace(scriptAndStyleRemover, '')
  .trim()
  .split(' ')
  .slice(0, 40)
  .join(' ')}...`, markdownOptions);

export const description = (str) => {
  const md = str
    // Remove all script and style tags
    .replace(scriptAndStyleRemover, '')
    .trim()
    // Remove headings
    .replace(/#+.+\n/gm, '')
    // Remove images
    .replace(/!\[.*?\]\((.*?)\)/gm, '')
    // Get 20 first words
    .split(' ')
    .slice(0, 20)
    .join(' ')
  return markdownParser(`${md}...`, markdownOptions);
}
