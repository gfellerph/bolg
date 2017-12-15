import markdownParser from 'marked';

const markdownOptions = {
  gfm: true,
  smartypants: true,
};

export const marked = (str, options) => {
  const mergedOptions = Object.assign({}, markdownOptions, options);
  const renderer = new markdownParser.Renderer();
  renderer.image = (href, title, text) => {
    let srcset;
    if (options.images) {
      // Only jpgs and pngs, no gifs
      const idRegex = /\/([A-Za-z0-9]+)$|%2F([A-Za-z0-9]+)\.[JjPp]/g;
      const match = idRegex.exec(href);
      const id = match ? match[1] || match[2] : null;
      if (id) {
        const thumbs = options.images[id];
        srcset = thumbs ? Object.keys(thumbs).map(key => `${thumbs[key]} ${key}w`).join(',') : null;
      }
    }
    const hrefAttr = href ? ` src="${href}"` : '';
    const titleAttr = title ? ` title="${title}"` : '';
    const altAttr = text ? ` alt="${text}"` : '';
    const srcsetAttr = srcset ? ` srcset="${srcset}"` : '';
    const sizesAttr = srcset ? ' sizes="640px"' : '';
    return `<img${hrefAttr}${titleAttr}${altAttr}${srcsetAttr}${sizesAttr}>`;
  }
  mergedOptions.renderer = renderer;
  return markdownParser(str, mergedOptions);
}

export const excerpt = str => markdownParser(`${str.split(' ').slice(0, 40).join(' ')}...`, markdownOptions);

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
