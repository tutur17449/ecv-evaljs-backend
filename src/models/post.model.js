/*
Import
*/
const mongoose = require("mongoose");
const { Schema } = mongoose;
//

/*
Definition
*/
const PostSchema = new Schema({
  // Schema.org
  "@context": { type: String, default: "http://schema.org" },
  "@type": { type: String, default: "Article" },

  headline: String,
  body: String,

  // Associer le profil utilisateur
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comment",
    },
  ],

  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "like",
    },
  ],

  // Définir une valeur par défaut
  creationDate: { type: Date, default: new Date() },
  dateModified: { type: Date, default: new Date() },
});

// ****************************************************
// @desc    After delete post, delete ref objects
// ****************************************************

PostSchema.post("deleteOne", { document: true, query: false }, async (doc) => {
  try {
    await Promise.all([
      mongoose.model("like").deleteMany({
        post: doc._id,
      }),
      mongoose.model("comment").deleteMany({
        post: doc._id,
      }),
    ]);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

module.exports = mongoose.model("post", PostSchema);
