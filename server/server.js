var express = require('express');
var app = express();
var bolg = require('../bolg');

// Serve the static files
app.use(express.static('public', { extensions: ['html']}));

// Listen for rebuild requests
app.get('/rebuild', (req, res) => {
  bolg
    .rebuildAll()
    .then(() => res.send({message: 'Rebuild complete.'}))
    .catch(err => res.status(500).send(err.stack));
});
app.get('/rebuild/:id', (req, res) => {
  var operation = req.params.id === 'index'
    ? bolg.rebuildIndex()
    : bolg.rebuild(req.params.id);
  operation
    .then(() => res.send({message: 'Rebuild complete.'}))
    .catch(err => res.status(500).send(err.stack));
});

app.listen(2222, function () {
  console.log('express server listening at http://localhost:2222');
});