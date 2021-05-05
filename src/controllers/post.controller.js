/* 
Imports
*/
const Models = require("../models/index");
//

/*  
CRUD methods
*/

// ****************************************************
// @desc    Create post
// @route   POST /api/post
// @access  Private
// ****************************************************

const createOne = (req) => {
  return new Promise((resolve, reject) => {
    Models.post
      .create(req.body)
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

// ****************************************************
// @desc    Get posts
// @route   GET /api/post
// @access  Public
// ****************************************************

const readAll = () => {
  return new Promise((resolve, reject) => {
    // Mongoose population to get associated data
    Models.post
      .find()
      .populate("author", ["-password"])
      .populate({
        path: "comments",
        select: "content author dateModified",
        populate: {
          path: "author",
          select: "givenName familyName",
        },
      })
      .populate("likes")
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
// @desc    Get post
// @route   GET /api/post/:id
// @access  Public
// ****************************************************

const readOne = (id) => {
  return new Promise((resolve, reject) => {
    // Mongoose population to get associated data
    Models.post
      .findById(id)
      .populate("author", ["-password"])
      .populate({
        path: "comments",
        select: "content author dateModified",
        populate: {
          path: "author",
          select: "givenName familyName",
        },
      })
      .populate("likes")
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
// @desc    Update post
// @route   PUT /api/post/:id
// @access  Private : author or admin
// ****************************************************

const updateOne = (req) => {
  return new Promise((resolve, reject) => {
    // Get post by ID
    Models.post
      .findById(req.params.id)
      .then((post) => {
        if (!post) {
          return reject("Comment not exist");
        }

        // Update object
        post.headline = req.body.headline;
        post.body = req.body.body;
        post.dateModified = new Date();

        if (
          String(req.user._id) !== String(post.author) &&
          req.user.role !== "admin"
        ) {
          return reject("Unhautorized");
        }

        post
          .save()
          .then((updatedPost) => resolve(updatedPost))
          .catch((updateError) => reject(updateError));
      })
      .catch((err) => reject(err));
  });
};

// ****************************************************
// @desc    Delete post
// @route   DELETE /api/post/:id
// @access  Private : author or admin
// ****************************************************

const deleteOne = (req) => {
  return new Promise((resolve, reject) => {
    // Delete object
    Models.post.findById(req.params.id, (err, post) => {
      if (err) {
        return reject(err);
      }

      if (!post) {
        return reject("Post not exist");
      }

      if (
        String(req.user._id) !== String(post.author) &&
        req.user.role !== "admin"
      ) {
        return reject("Unhautorized");
      }

      post
        .deleteOne()
        .then((response) => resolve(post))
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
