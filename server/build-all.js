const bolg = require('../bolg');

bolg.publishAll()
  .then(bolg.buildIndex)
  .then(() => {
    console.log('rebuilt'); process.exit(0);
  }).catch((err) => { throw err; });
