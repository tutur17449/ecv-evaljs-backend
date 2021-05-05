/* 
Imports
*/
// NPM modules
require("dotenv").config(); //=> https://www.npmjs.com/package/dotenv
const express = require("express"); //=> https://www.npmjs.com/package/express
const cookieParser = require("cookie-parser"); //=> https://www.npmjs.com/package/cookie-parser
const passport = require("./src/lib/passport"); //=> https://www.npmjs.com/package/passport
const path = require("path"); //=> https://www.npmjs.com/package/path
// Services
const MONGOclass = require("./src/database/mongo.class");
const { dirname } = require("path");
//

/*
Server class
*/
class ServerClass {
  constructor() {
    this.server = express();
    this.port = process.env.PORT;
    this.MongoDB = new MONGOclass();
  }

  init() {
    // Set CORS
    this.server.use((req, res, next) => {
      // Define allowed origins
      const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
      const origin = req.headers.origin;

      // Setup CORS
      if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
      res.header("Access-Control-Allow-Credentials", true);
      res.header("Access-Control-Allow-Methods", [
        "GET",
        "PUT",
        "POST",
        "DELETE",
        "POST",
      ]);
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );

      // Use next() function to continue routing
      next();
    });

    this.server.use(passport.initialize());

    //=> Set server view engine: use EJS (https://ejs.co)
    this.server.set("view engine", "ejs");

    //=> Static path configuration: define 'www' folder for backoffice static files
    this.server.set("views", __dirname + "/public");
    this.server.use(express.static(path.join(__dirname, "public")));

    //=> Set body request with ExpressJS: BodyParser not needed (http://expressjs.com/fr/api.html#express.json)
    this.server.use(express.json({ limit: "20mb" }));
    this.server.use(express.urlencoded({ extended: true }));

    //=> Set CookieParser to setup serverside cookies
    this.server.use(cookieParser(process.env.COOKIE_SECRET));

    // Start server configuration
    this.config();
  }

  config() {
    // Set AUTH router
    const AuthRouterClass = require("./src/routes/auth.router");
    const authRouter = new AuthRouterClass({ passport });
    this.server.use("/auth", authRouter.init());

    // Set API router
    const ApiRouterClass = require("./src/routes/api.router");
    const apiRouter = new ApiRouterClass({ passport });
    this.server.use("/api", apiRouter.init());

    // Set backend router
    const BackendRouterClass = require("./src/routes/backend.router");
    const backendRouter = new BackendRouterClass({ passport });
    this.server.use("/", backendRouter.init());

    // Launch server
    this.launch();
  }

  launch() {
    // Start MongoDB connection
    this.MongoDB.connectDb()
      .then((db) => {
        // Start server
        this.server.listen(this.port, () => {
          console.log({
            node: `http://localhost:${this.port}`,
            mongo: db.url,
          });
        });
      })
      .catch((dbErr) => console.log("MongoDB Error", dbErr));
  }
}
//

/* 
Start server
*/
const NodeApp = new ServerClass();
NodeApp.init();
//
