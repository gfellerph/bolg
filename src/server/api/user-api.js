import User from 'src/models/UserModel';
import jwt from 'jsonwebtoken';

export const list = (req, res, next) =>
  User.find({})
    .then((data) => res.json(data))
    .catch((err) => next(err));

export const getUser = (req, res) => {
  res.json(req.user);
};

export const registerUser = (req, res, next) => {
  const { email, password, displayName } = req.body;
  const user = new User({ email, password, displayName });
  user
    .save()
    .then((newUser) => res.json(newUser))
    .catch((err) => next(err));
};

export const authenticateUser = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .select('email password')
    .then((user) => {
      if (!user) {
        res.status = 401;
        return next(new Error('You shall not pass'));
      }

      return user.comparePassword(req.body.password);
    })
    .then((user) => {
      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '7 days',
      });

      // Don't transmit password to frontend...
      const returnUser = user.toJSON();
      delete returnUser.password;

      return res.json({ token, user: returnUser });
    })
    .catch((err) => {
      res.status = 401;
      next(err);
    });
};

export const remove = (req, res, next) =>
  User.remove({
    _id: req.params.id,
  })
    .then((data) => res.json(data))
    .catch((err) => next(err));
