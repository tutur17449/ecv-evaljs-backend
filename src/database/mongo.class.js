/* 
Import
*/
// NPM moodules
const mongoose = require("mongoose"); //=> https://www.npmjs.com/package/mongoose
//

/*  
Define class
*/
class MONGOClass {
  constructor() {
    // Set MongoDB url
    this.mongoUrl = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/`;
    this.mongoConf = {
      dbName: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      pass: process.env.DATABASE_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }

  connectDb() {
    return new Promise((resolve, reject) => {
      mongoose
        .connect(this.mongoUrl, this.mongoConf)
        .then((db) => resolve({ db: db, url: this.mongoUrl }))
        .catch((dbErr) => {
          console.log(dbErr);
          reject(`MongoDB not connected`, dbErr);
        });
    });
  }
}
//

/* 
Export class
*/
module.exports = MONGOClass;
//
