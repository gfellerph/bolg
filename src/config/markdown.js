import markdownParser from 'marked';
import { sizes, getThumbUrl } from 'src/config/constants';

const markdownOptions = {
  gfm: true,
  smartypants: true,
};

export const marked = (str, options) => {
  const renderer = new markdownParser.Renderer();
  renderer.image = (href, title, text) => {
    let srcset = false;
    // Filter self hosted images as well as jpgs and pngs, no gifs
    if (href.indexOf('//adie.bisnaer.ch/') >= 0) {
      srcset = sizes
        .map(size => `${getThumbUrl(href, size.width)} ${size.width}w`)
        .join(',');
    }
    const hrefAttr = href ? ` src="${href}"` : '';
    const titleAttr = title ? ` title="${title}"` : '';
    const altAttr = text ? ` alt="${text}"` : '';
    const srcsetAttr = srcset ? ` srcset="${srcset}"` : '';
    const sizesAttr = srcset ? ' sizes="(max-width: 640px) 100vw, 640px"' : '';
    return `<img${hrefAttr}${titleAttr}${altAttr}${srcsetAttr}${sizesAttr}>`;
  }
  const mergedOptions = Object.assign({}, markdownOptions, options);
  mergedOptions.renderer = renderer;
  return markdownParser(str, mergedOptions);
}

export const excerpt = str => markdownParser(`${str.replace(/<s[ct].+>.+<\/s[ct].+>/g, '').split(' ').slice(0, 40).join(' ')}...`, markdownOptions);

export const description = (str) => {
  const md = str
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
