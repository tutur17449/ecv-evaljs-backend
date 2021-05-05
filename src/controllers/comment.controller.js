/* 
Imports
*/
const Models = require("../models/index");
//

// ****************************************************
// @desc    Create comment
// @route   POST /api/comment
// @access  Private
// ****************************************************

const createOne = (req) => {
  return new Promise((resolve, reject) => {
    Models.comment
      .create(req.body)
      .then((data) => {
        data
          .populate({
            path: "author",
            select: "givenName familyName",
          })
          .execPopulate()
          .then((fullData) => resolve(data))
          .catch((err) => reject(errr));
      })
      .catch((err) => reject(err));
  });
};

// ****************************************************
// @desc    Get comments
// @route   GET /api/comment
// @access  Public
// ****************************************************

const readAll = () => {
  return new Promise((resolve, reject) => {
    // Mongoose population to get associated data
    Models.comment
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
// @desc    Get comment
// @route   GET /api/comment/:id
// @access  Public
// ****************************************************

const readOne = (id) => {
  return new Promise((resolve, reject) => {
    // Mongoose population to get associated data
    Models.comment
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
// @desc    Update comment
// @route   PUT /api/comment/:id
// @access  Private : author or admin
// ****************************************************

const updateOne = (req) => {
  return new Promise((resolve, reject) => {
    // Get comment by ID
    Models.comment
      .findById(req.params.id)
      .then((comment) => {
        if (!comment) {
          return reject("Comment not exist");
        }

        // Update object
        comment.content = req.body.content;
        comment.dateModified = new Date();

        if (
          String(req.user._id) !== String(comment.author) &&
          req.user.role !== "admin"
        ) {
          return reject("Unhautorized");
        }

        Models.comment
          .updateOne(
            {
              _id: req.params.id,
            },
            comment
          )
          .then((updatedComment) => resolve(comment))
          .catch((updateError) => reject(updateError));
      })
      .catch((err) => reject(err));
  });
};

// ****************************************************
// @desc    Delete comment
// @route   DELETE /api/comment/:id
// @access  Private : author or admin
// ****************************************************

const deleteOne = (req) => {
  return new Promise((resolve, reject) => {
    // Delete object
    Models.comment.findById(req.params.id, (err, comment) => {
      if (err) {
        return reject(err);
      }

      if (!comment) {
        return reject("Comment not exist");
      }

      if (
        String(req.user._id) !== String(comment.author) &&
        req.user.role !== "admin"
      ) {
        return reject("Unhautorized");
      }

      comment
        .deleteOne()
        .then((response) => resolve(comment))
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
  updateOne,
  deleteOne,
};
//
