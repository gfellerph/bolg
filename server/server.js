var express = require('express');
var app = express();
var bolg = require('../bolg');

// Serve the static files
app.use(express.static('public', { extensions: ['html']}));

// Listen for rebuild requests
app.get('/rebuild/', (req, res) => {
  bolg.rebuildAll();
  res.send({message: 'Rebuild complete.'});
});
app.get('/rebuild/:id', (req, res) => {
  bolg
    .rebuild(req.params.id)
    .then(() => {
      res.send({id: req.params.id});
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err.stack);
    });
});

app.listen(2222, function () {
  console.log('express server listening at http://localhost:2222');
});