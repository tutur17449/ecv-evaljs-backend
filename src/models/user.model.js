/*
Import
*/
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
//

/*
Definition
*/
const UserSchema = new Schema({
  // Schema.org
  "@context": { type: String, default: "http://schema.org" },
  "@type": { type: String, default: "Person" },

  givenName: String,
  familyName: String,
  password: String,

  role: {
    type: String,
    default: "user",
  },

  // Définir une valeur de propriété unique
  email: { unique: true, type: String },

  // Définir une valeur par défaut
  creationDate: { type: Date, default: new Date() },
  banished: { type: Boolean, default: false },
});

// ****************************************************
// @desc    User method to generate jwt
// ****************************************************

UserSchema.methods.generateJwt = (user) => {
  // Set token
  const jwtObject = {
    _id: user._id,
    email: user.email,
    password: user.password,
    banished: user.banished,
  };

  // Retunr JWT
  return jwt.sign(jwtObject, process.env.JWT_SECRET, { expiresIn: 86400000 });
};

// ****************************************************
// @desc    User method to compare password with bcrypt
// ****************************************************

UserSchema.statics.comparePassword = function (reqPwd, dbPwd) {
  return bcrypt.compareSync(reqPwd, dbPwd);
};

// ****************************************************
// @desc    User method to serialize user with related data
// ****************************************************

UserSchema.statics.serializeUser = function (userId) {
  return Promise.all([
    mongoose
      .model("like")
      .find({ author: userId })
      .populate("post", ["headline"]),
    mongoose
      .model("comment")
      .find({ author: userId })
      .populate("post", ["headline"]),
  ]);
};

// ****************************************************
// @desc    Before create user, hash password with bcrypt
// ****************************************************

UserSchema.pre("save", function (next) {
  var user = this;
  if (user.password) {
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
          if (err) {
            return next(err);
          }
          user.password = hash;
          next();
        });
      });
    } else {
      return next();
    }
  } else {
    return next();
  }
});

module.exports = mongoose.model("user", UserSchema);
