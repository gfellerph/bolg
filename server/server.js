var express = require('express');
var app = express();
var bolg = require('../bolg');

// Serve the static files
app.use(express.static('public', { extensions: ['html']}));

// Listen for rebuild requests
app.get('/rebuild', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  bolg
    .rebuildAll()
    .then(bolg.rebuildIndex)
    .then(() => res.send({message: 'Rebuild complete.'}))
    .catch(err => res.status(500).send(err.stack));
});
app.get('/rebuild/:id', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  var operation = req.params.id === 'index'
    ? bolg.rebuildIndex()
    : bolg.rebuild(req.params.id);
  operation
    .then(bolg.rebuildIndex)
    .then(() => res.send({message: 'Rebuild complete.'}))
    .catch(err => res.status(500).send(err.stack));
});

app.listen(2222, function () {
  bolg.rebuildAll()
    .then(bolg.rebuildIndex)
    .then(() => {
      console.log('express server listening at http://localhost:2222');
    });
});