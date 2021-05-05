const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy; //=> https://www.npmjs.com/package/passport-jwt
const Models = require("../models/index");

// Extract token from cookie
const cookieExtractor = (req, res) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[process.env.COOKIE_NAME];
  }
  return token;
};

var opts = {};

opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    Models.user.findOne({ _id: jwt_payload._id }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

module.exports = passport;
