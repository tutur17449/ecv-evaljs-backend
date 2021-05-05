/*
Import
*/
const mongoose = require("mongoose");
const { Schema } = mongoose;
//

/*
Definition
*/
const CommentSchema = new Schema({
  // Schema.org
  "@context": { type: String, default: "http://schema.org" },
  "@type": { type: String, default: "Commentaire" },

  content: {
    type: String,
  },

  // Associer le profil utilisateur
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },

  // Associer à un post
  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },

  // Définir une valeur par défaut
  creationDate: { type: Date, default: new Date() },
  dateModified: { type: Date, default: new Date() },
});

// ****************************************************
// @desc    After new comment, update post Comments field
// ****************************************************

CommentSchema.post("save", async (doc) => {
  try {
    await mongoose.model("post").updateOne(
      { _id: doc.post },
      {
        $push: {
          comments: doc._id,
        },
      }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
});

// ****************************************************
// @desc    After delete comment, update post Comments field
// ****************************************************

CommentSchema.post(
  "deleteOne",
  { document: true, query: false },
  async (doc) => {
    try {
      await mongoose.model("post").updateOne(
        { _id: doc.post },
        {
          $pull: {
            comments: doc._id,
          },
        }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
);

// ****************************************************
// @desc    Run hook after db seed
// ****************************************************

CommentSchema.post("insertMany", (docs) => {
  return Promise.all(
    docs.map((doc) =>
      mongoose.model("post").updateOne(
        { _id: doc.post },
        {
          $push: {
            comments: doc._id,
          },
        }
      )
    )
  );
});

module.exports = mongoose.model("comment", CommentSchema);
