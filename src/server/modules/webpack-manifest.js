import fs from 'fs';
import inlineCSS from 'src/server/modules/inline-css';

/**
 * Gets source entries from the webpack manifest for referencing assets
 * with cache-busting hash filenames
 * @returns {Object} Webpack manifest assets lookup list for asset paths
 */
export default function webpackManifest() {
  const manifest = JSON.parse(fs.readFileSync('public/config/front.manifest.json', 'utf8'));
  return Object.keys(manifest).reduce((acc, entry) => {
    acc[entry] = entry.endsWith('.css') ? inlineCSS(manifest[entry]) : manifest[entry];
    return acc;
  }, {});
}
