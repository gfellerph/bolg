import path from 'path';
import fs from 'fs';

/**
 * Returns a style rule either inlined as <style> or as <link> element
 * @param {String} filepath Path to the CSS file
 * @param {Number} [cssInlineThreshold=15] Threshold in KB, below is inlined, above is linked
 * @returns {String} A <style> or <link> Tag, depending on threshold
 */
export default function inlineCSS(filepath, cssInlineThreshold = 15) {
  if (!filepath.endsWith('.css')) return '';

  const filePath = path.resolve(`${process.cwd()}/public${filepath}`);
  const fileStats = fs.statSync(filePath);
  const devMode = process.env.NODE_ENV === 'development';
  let html = '';

  if (!devMode && fileStats.size / 1000.0 < cssInlineThreshold) {
    // Inline the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    html = `<style>${fileContent}</style>`;
  } else {
    html = `<link rel="stylesheet" href="${filepath}">`;
  }

  return html;
}
