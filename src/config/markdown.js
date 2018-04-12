import markdownParser from 'marked';
import { getSrcset } from 'src/config/constants';

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
      srcset = getSrcset(href);
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
