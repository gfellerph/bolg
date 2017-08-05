import markdownParser from 'marked';

const markdownOptions = {
  gfm: true,
  smartypants: true,
};

export const marked = (str, options) => {
  const mergedOptions = Object.assign({}, markdownOptions, options);
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
