/* 
Imports
*/
const Models = require("../models/index");
const bcrypt = require("bcryptjs");
//

/*  
Controller methods
*/

// ****************************************************
// @desc    Register user
// @route   POST /auth/register
// @access  Public
// ****************************************************

const register = (req) => {
  return new Promise(async (resolve, reject) => {
    Models.user.findOne({ email: req.body.email }, (err, data) => {
      if (err) {
        return reject(err);
      }
      if (data) {
        return reject("User already exist");
      }
      Models.user
        .create(req.body)
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  });
};

// ****************************************************
// @desc    Login user
// @route   POST /auth/login
// @access  Public
// ****************************************************

const login = (req, res) => {
  return new Promise((resolve, reject) => {
    // Find user from email
    Models.user.findOne({ email: req.body.email }, (err, data) => {
      if (err || data === null) {
        return reject("Email not found");
      } else {
        // Check user password
        const validatedPassword = Models.user.comparePassword(
          req.body.password,
          data.password
        );

        if (!validatedPassword) {
          return reject("Invalid password");
        } else {
          // Generate user JWT
          const userJwt = data.generateJwt(data);

          // Set response cookie
          res.cookie(process.env.COOKIE_NAME, userJwt, {
            maxAge: 86400000,
            httpOnly: true,
          });

          Models.user
            .serializeUser(data._id)
            .then((userData) =>
              resolve({
                userData: data,
                userLikes: userData[0],
                userComments: userData[1],
              })
            )
            .catch((err) => reject(err));
        }
      }
    });
  });
};

// ****************************************************
// @desc    Verify user token
// @route   GET /auth/me
// @access  Private
// ****************************************************

const checkAuth = (req, res) => {
  return new Promise((resolve, reject) => {
    Models.user
      .serializeUser(req.user._id)
      .then((userData) =>
        resolve({
          userData: req.user,
          userLikes: userData[0],
          userComments: userData[1],
        })
      )
      .catch((err) => reject(err));
  });
};

// ****************************************************
// @desc    Logout user
// @route   GET /auth/logout
// @access  Public
// ****************************************************

const logout = (req, res) => {
  return new Promise((resolve, reject) => {
    res.clearCookie(process.env.COOKIE_NAME);

    return resolve(true);
  });
};
//

/* 
Export controller methods
*/
module.exports = {
  register,
  login,
  checkAuth,
  logout,
};
//
