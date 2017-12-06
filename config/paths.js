const path = require('path');

const root = path.resolve(__dirname, '..');

module.exports = {
  root,
  src: path.resolve(root, 'src'),
  test: path.resolve(root, 'test'),
  public: path.resolve(root, 'public'),
  server: path.resolve(root, 'server'),
  static: path.resolve(root, 'src/static'),
  frontManifest: 'config/front.manifest.json',
  backIndex: path.resolve(root, 'src/server/templates/bolg.html'),
  serviceWorkerDev: path.resolve(root, 'config/service-worker-dev.js'),
  serviceWorkerProd: path.resolve(root, 'config/service-worker-prod.js'),
  assets: '/',
  resolve: segment => path.resolve(root, segment),
};
