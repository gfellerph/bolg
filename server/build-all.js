const bolg = require('../bolg');

bolg.rebuildAll()
  .then(bolg.rebuildIndex)
  .then(() => {
    console.log('rebuilt'); process.exit(0);
  }).catch((err) => { throw err; });
