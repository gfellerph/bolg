import User from 'src/models/UserModel';
import jwt from 'jsonwebtoken';

export const getUser = (req, res) => {
  res.json(req.user);
}

export const registerUser = (req, res) => {
  const { email, password, displayName } = req.body;
  const user = new User({ email, password, displayName });
  user.save()
    .then(newUser => res.json(newUser))
    .catch((err) => {
      res.status = err.status || 500;
      res.send(err.message);
    });
}

export const authenticateUser = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        res.status = 401;
        return res.send('You shall not pass');
      }

      user.comparePassword(req.body.password)
        .then(() => {
          const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: '7 days',
          });

          return res.json({ token });
        })
        .catch((err) => {
          console.error('no pw match', err);
          res.status = 401;
          res.json(err);
        })
    })
    .catch((err) => {
      console.error('no user find');
      res.status = 401;
      res.json(err);
    });
}
