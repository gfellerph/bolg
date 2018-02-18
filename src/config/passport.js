import passport from 'passport';
import passportJWT from 'passport-jwt';
import User from 'src/models/UserModel';

const { ExtractJwt, Strategy } = passportJWT;

const strategy = new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}, (payload, next) => {
  User.findOne({
    id: payload.id,
  })
    .then(user => next(null, user))
    .catch(() => next(null, false))
});

passport.use(strategy);

export default passport;
