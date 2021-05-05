/*
Imports
*/
// Node
const express = require("express"); //=> https://www.npmjs.com/package/express

// Inner
const Controllers = require("../controllers/index");
const { checkFields } = require("../helpers/request.service");
const Mandatory = require("../mandatories/mandatory.service");
const {
  sendApiSuccessResponse,
  sendApiErrorResponse,
} = require("../helpers/response.service");
//

/*  
Routes definition
*/
class RouterClass {
  // Include Passport authentication service from server file in the RouterClass
  constructor({ passport }) {
    this.passport = passport;
    this.router = express.Router();
  }

  routes() {
    // [AUTH] get data from client to register new user
    this.router.post("/register", async (req, res) => {
      // Check body data
      console.log(req.body);

      if (
        typeof req.body === "undefined" ||
        req.body === null ||
        Object.keys(req.body).length === 0
      ) {
        return sendApiErrorResponse(
          req,
          res,
          null,
          "No data provided in the reqest body"
        );
      } else {
        // Check body data
        const { ok, extra, miss } = checkFields(Mandatory.register, req.body);

        // Error: bad fields provided
        if (!ok) {
          return sendApiErrorResponse(
            req,
            res,
            { extra, miss },
            "Bad fields provided"
          );
        } else {
          Controllers.auth
            .register(req)
            .then((apiResponse) =>
              sendApiSuccessResponse(req, res, apiResponse, "Request succeed")
            )
            .catch((apiError) =>
              sendApiErrorResponse(res, res, apiError, apiError)
            );
        }
      }
    });

    // [AUTH] get data from client to log user
    this.router.post("/login", (req, res) => {
      // Check body data
      if (
        typeof req.body === "undefined" ||
        req.body === null ||
        Object.keys(req.body).length === 0
      ) {
        return sendApiErrorResponse(
          req,
          res,
          null,
          "No data provided in the reqest body"
        );
      } else {
        // Check body data
        const { ok, extra, miss } = checkFields(Mandatory.login, req.body);

        // Error: bad fields provided
        if (!ok) {
          return sendApiErrorResponse(
            req,
            res,
            { extra, miss },
            "Bad fields provided"
          );
        } else {
          Controllers.auth
            .login(req, res)
            .then((apiResponse) =>
              sendApiSuccessResponse(req, res, apiResponse, "Request succeed")
            )
            .catch((apiError) =>
              sendApiErrorResponse(res, res, apiError, apiError)
            );
        }
      }
    });

    // [AUTH] logout user
    this.router.get("/logout", (req, res) => {
      Controllers.auth
        .logout(req, res)
        .then((apiResponse) =>
          sendApiSuccessResponse(req, res, apiResponse, "Request succeed")
        )
        .catch((apiError) =>
          sendApiErrorResponse(res, res, apiError, apiError)
        );
    });

    // [AUTH] check user token
    this.router.get(
      "/me",
      this.passport.authenticate("jwt", { session: false }),
      (req, res) => {
        Controllers.auth
          .checkAuth(req, res)
          .then((apiResponse) =>
            sendApiSuccessResponse(
              req,
              res,
              apiResponse,
              "User cookie extracted"
            )
          )
          .catch((apiError) =>
            sendApiErrorResponse(
              res,
              res,
              apiError,
              "User cookie not extracted"
            )
          );
      }
    );
  }

  init() {
    // Get route fonctions
    this.routes();

    // Sendback router
    return this.router;
  }
}
//

/*
Export
*/
module.exports = RouterClass;
//
