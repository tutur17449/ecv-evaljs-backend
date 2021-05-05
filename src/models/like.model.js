/*
Import
*/
const mongoose = require("mongoose");
const { Schema } = mongoose;
//

/*
Definition
*/
const LikeSchema = new Schema({
  // Schema.org
  "@context": { type: String, default: "http://schema.org" },
  "@type": { type: String, default: "Like" },

  // Associer le profil utilisateur
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },

  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
  },

  // Définir une valeur par défaut
  creationDate: { type: Date, default: new Date() },
});
//

// ****************************************************
// @desc    After new like, update post Likes field
// ****************************************************

LikeSchema.post("save", async (doc) => {
  try {
    await mongoose.model("post").updateOne(
      { _id: doc.post },
      {
        $push: {
          likes: doc._id,
        },
      }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
});

// ****************************************************
// @desc    After delete like, update post Likes field
// ****************************************************

LikeSchema.post("deleteOne", { document: true, query: false }, async (doc) => {
  try {
    await mongoose.model("post").updateOne(
      { _id: doc.post },
      {
        $pull: {
          likes: doc._id,
        },
      }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
});

// ****************************************************
// @desc    Run hook after db seed
// ****************************************************

LikeSchema.post("insertMany", (docs) => {
  return Promise.all(
    docs.map((doc) =>
      mongoose.model("post").updateOne(
        { _id: doc.post },
        {
          $push: {
            likes: doc._id,
          },
        }
      )
    )
  );
});

module.exports = mongoose.model("like", LikeSchema);
