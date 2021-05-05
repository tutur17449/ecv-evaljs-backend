/* 
Imports
*/
const Models = require("../models/index");
//

/*  
CRUD methods
*/

// ****************************************************
// @desc    Create like
// @route   POST /api/like
// @access  Private
// ****************************************************

const createOne = (req) => {
  return new Promise((resolve, reject) => {
    Models.like.findOne(
      {
        author: req.user._id,
        post: req.body.post,
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }

        if (data) {
          return reject("Post already like");
        }

        Models.like
          .create(req.body)
          .then((data) => resolve(data))
          .catch((err) => reject(err));
      }
    );
  });
};

// ****************************************************
// @desc    Get likes
// @route   GET /api/like
// @access  Public
// ****************************************************

const readAll = () => {
  return new Promise((resolve, reject) => {
    // Mongoose population to get associated data
    Models.like
      .find()
      .populate("author", ["-password"])
      .populate("post")
      .exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
  });
};

// ****************************************************
// @desc    Get like
// @route   GET /api/like/:id
// @access  Public
// ****************************************************

const readOne = (id) => {
  return new Promise((resolve, reject) => {
    // Mongoose population to get associated data
    Models.like
      .findById(id)
      .populate("author", ["-password"])
      .populate("post")
      .exec((err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
  });
};

// ****************************************************
// @desc    Delete like
// @route   DELETE /api/like/:id
// @access  Private : author or admin
// ****************************************************

const deleteOne = (req) => {
  return new Promise((resolve, reject) => {
    // Delete object
    Models.like.findById(req.params.id, (err, like) => {
      if (err) {
        return reject(err);
      }

      if (!like) {
        return reject("Like not exist");
      }

      if (
        String(req.user._id) !== String(like.author) &&
        req.user.role !== "admin"
      ) {
        return reject("Unhautorized");
      }

      like
        .deleteOne()
        .then((response) => resolve(like))
        .catch((err) => reject(err));
    });
  });
};
//

/* 
Export controller methods
*/
module.exports = {
  readAll,
  readOne,
  createOne,
  deleteOne,
};
//
