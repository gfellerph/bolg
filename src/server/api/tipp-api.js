import Tipp from 'src/models/TippModel';

export const postTipp = (req, res) => {
  const tipp = new Tipp(req.body);

  tipp.save()
    .then(newTipp => res.json(newTipp))
    .catch((err) => {
      res.status = 500;
      res.send(err.message);
    });
};

export const deleteTipp = (req, res) => {
  Tipp.remove({
    _id: req.params.id,
  })
    .then(() => res.send('OK'))
    .catch((err) => {
      res.status = 500;
      res.send(err.message);
    });
};

export const putTipp = (req, res) => {
  Tipp.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  })
    .then(() => res.send('OK'))
    .catch((err) => {
      res.status = 500;
      res.send(err.message);
    });
};

export const listTipps = (req, res) => {
  Tipp.find({})
    .then(tipps => res.json(tipps))
    .catch((err) => {
      res.status = 500;
      res.send(err.message);
    });
};

export const getTipp = (req, res) => {
  Tipp.findOne({
    _id: req.params.id,
  })
    .then(tipp => res.json(tipp))
    .catch((err) => {
      res.status = 500;
      res.send(err.message);
    });
};
