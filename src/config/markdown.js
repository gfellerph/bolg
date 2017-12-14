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
      const idRegex = /%2F([A-Za-z0-9]+)\.[JPjp]/g;
      const match = idRegex.exec(href);
      const id = match ? match[1] : null;
      if (id) {
        const thumbs = options.images[id];
        srcset = thumbs ? Object.keys(thumbs).map(key => `${thumbs[key]} ${key}w`).join(',') : null;
      }
    }
    const hrefAttr = href ? ` src="${href}"` : '';
    const titleAttr = title ? ` title="${title}"` : '';
    const altAttr = text ? ` alt="${text}"` : '';
    const srcsetAttr = srcset ? ` srcset="${srcset}"` : '';
    return `<img${hrefAttr}${titleAttr}${altAttr}${srcsetAttr}>`;
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
