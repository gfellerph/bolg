import markdownParser from 'marked';
// import { sizes } from 'src/config/constants';

const markdownOptions = {
  gfm: true,
  smartypants: true,
};

// const extensionRegex = /\.(jpe?g|png)$/i;

export const marked = (str, options) => {
  const renderer = new markdownParser.Renderer();
  /* renderer.image = (href, title, text) => {
    // let srcset = false;
    // Filter jpgs and pngs, no gifs
    if (options && options.srcset && extensionRegex.test(href)) {
      // srcset = sizes.map(size => )
      /* if (id) {
        const thumbs = options.images[id];
        srcset = thumbs ? Object.keys(thumbs).map(key => `${thumbs[key]} ${key}w`).join(',') : null;
      }
    }
    const hrefAttr = href ? ` src="${href}"` : '';
    const titleAttr = title ? ` title="${title}"` : '';
    const altAttr = text ? ` alt="${text}"` : '';
    // const srcsetAttr = srcset ? ` srcset="${srcset}"` : '';
    // const sizesAttr = srcset ? ' sizes="640px"' : '';
    return `<img${hrefAttr}${titleAttr}${altAttr}${srcsetAttr}${sizesAttr}>`;
  } */
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
