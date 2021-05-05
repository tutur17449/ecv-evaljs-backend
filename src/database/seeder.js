const dotenv = require("dotenv");
dotenv.config();
const MONGOclass = require("./mongo.class");
const Models = require("../models/index");

const MongoDB = new MONGOclass();

const createAdminUser = async () => {
  try {
    await MongoDB.connectDb();
    // Create users
    const adminUser = await Models.user.create({
      givenName: "Admin",
      familyName: "Admin",
      password: "admin",
      email: "admin@test.fr",
      role: "admin",
    });

    console.log("Admin user created : admin@test.fr / admin");

    const testUser = await Models.user.create({
      givenName: "Test",
      familyName: "Test",
      password: "test",
      email: "test@test.fr",
      role: "user",
    });

    console.log("Test user created : test@test.fr / test");

    // Create posts
    const posts = await Models.post.insertMany([
      {
        headline: "Sed ut perspiciatis unde omnis iste",
        body:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
        author: testUser._id,
      },
      {
        headline: "At vero eos et accusamus",
        body:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
        author: testUser._id,
      },
      {
        headline: "Itaque earum rerum hic",
        body:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
        author: adminUser._id,
      },
      {
        headline: "Neque porro quisquam",
        body:
          "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
        author: adminUser._id,
      },
    ]);

    console.log("Posts inserted");

    // Create comments
    await Models.comment.insertMany([
      {
        content: "This post is awesome !!!",
        post: posts[2]._id,
        author: testUser._id,
      },
      {
        content: "Thanks for share",
        post: posts[3]._id,
        author: testUser._id,
      },
      {
        content: "Not bad !",
        post: posts[0]._id,
        author: adminUser._id,
      },
      {
        content: "Cool",
        post: posts[1]._id,
        author: adminUser._id,
      },
      {
        content: "This post is awesome !!!",
        post: posts[0]._id,
        author: testUser._id,
      },
      {
        content: "Thanks for share",
        post: posts[2]._id,
        author: testUser._id,
      },
      {
        content: "Not bad !",
        post: posts[2]._id,
        author: adminUser._id,
      },
      {
        content: "Cool",
        post: posts[3]._id,
        author: adminUser._id,
      },
    ]);

    console.log("Comments inserted");

    // Create likes
    await Models.like.insertMany([
      {
        post: posts[2]._id,
        author: testUser._id,
      },
      {
        post: posts[3]._id,
        author: testUser._id,
      },
      {
        post: posts[0]._id,
        author: adminUser._id,
      },
      {
        post: posts[1]._id,
        author: adminUser._id,
      },
    ]);

    console.log("Likes inserted");

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

createAdminUser();
