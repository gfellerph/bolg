import Journey from 'src/models/JourneyModel';

export const list = (req, res, next) => {
  return Journey.find({}, 'lat lng')
    .then(res.json)
    .catch(next);
}

export const remove = (req, res, next) => {
  return Journey.remove({
    _id: req.params.id,
  })
    .then(res.json)
    .catch(next);
}
