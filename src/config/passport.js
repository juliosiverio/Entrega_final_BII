const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'devSecretKeyChangeMe';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use('current', new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.id).populate('cart');

    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    return done(null, {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart,
    });
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;

