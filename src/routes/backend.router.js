/*
Imports
*/
// Node
const express = require("express");

// Inner
const Controllers = require("../controllers/index");
const { checkFields } = require("../helpers/request.service");
const Mandatory = require("../mandatories/mandatory.service");
const {
  renderSuccessVue,
  renderErrorVue,
} = require("../helpers/response.service");
//

/*
Routes definition
*/
class BackendRouter {
  constructor({ passport }) {
    this.passport = passport;
    this.router = express.Router();
  }

  routes() {
    // ****************************************************
    // @desc    Render default page with all posts
    // @route   GET /backend
    // @access  Private
    // ****************************************************
    this.router.get(
      "/",
      this.passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/login",
      }),
      (req, res) => {
        Controllers.post
          .readAll()
          .then((apiResponse) =>
            renderSuccessVue(
              "index",
              req,
              res,
              apiResponse,
              "Request succeed",
              false
            )
          )
          .catch((apiError) =>
            renderErrorVue("index", req, res, apiError, "Request failed")
          );
      }
    );

    // ****************************************************
    // @desc    Get login view
    // @route   GET /backend/login
    // @access  Public
    // ****************************************************
    this.router.get("/login", (req, res) => {
      renderSuccessVue("login", req, res, null, "Request succeed", false);
    });

    // ****************************************************
    // @desc    ReadOne for enpoints
    // @route   GET /backend/:endpoint/:id
    // @access  Private
    // ****************************************************
    this.router.get(
      "/:endpoint/:id",
      this.passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/login",
      }),
      async (req, res) => {
        try {
          const data = await Controllers[req.params.endpoint].readOne(
            req.params.id
          );
          renderSuccessVue(
            req.params.endpoint,
            req,
            res,
            data,
            "Request succeed",
            false
          );
        } catch (err) {
          renderErrorVue("error", req, res, null, "Request failed");
        }
      }
    );

    // ****************************************************
    // @desc    Login user
    // @route   POST /backend/login
    // @access  Public
    // ****************************************************
    this.router.post("/login", (req, res) => {
      // Check body data
      if (
        typeof req.body === "undefined" ||
        req.body === null ||
        Object.keys(req.body).length === 0
      ) {
        return renderErrorVue(
          "index",
          req,
          res,
          "No data provided",
          "Request failed"
        );
      } else {
        // Check body data
        const { ok, extra, miss } = checkFields(Mandatory.login, req.body);

        // Error: bad fields provided
        if (!ok) {
          return renderErrorVue(
            "index",
            "/Login",
            "POST",
            res,
            "Bad fields provided",
            { extra, miss }
          );
        } else {
          Controllers.auth
            .login(req, res)
            .then((apiResponse) =>
              renderSuccessVue("/", req, res, "User logged", apiResponse, true)
            )
            .catch((apiError) =>
              renderErrorVue("login", req, res, apiError, "Request failed")
            );
        }
      }
    });

    // ****************************************************
    // @desc    Create for endpoints
    // @route   POST /backend/:endpoint
    // @access  Private
    // ****************************************************

    this.router.post(
      "/:endpoint/create",
      this.passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/",
      }),
      (req, res) => {
        // Check body data
        if (
          typeof req.body === "undefined" ||
          req.body === null ||
          Object.keys(req.body).length === 0
        ) {
          return renderErrorVue(
            "index",
            req,
            res,
            "No data provided",
            "Request failed"
          );
        }
        // Check body data
        const { ok, extra, miss } = checkFields(
          Mandatory[req.params.endpoint],
          req.body
        );

        // Error: bad fields provided
        if (!ok) {
          return renderErrorVue(
            "index",
            `/${req.params.endpoint}`,
            "POST",
            res,
            "Bad fields provided",
            { extra, miss }
          );
        }
        // Add author _id
        req.body.author = req.user._id;
        Controllers[req.params.endpoint]
          .createOne(req)
          .then((apiResponse) => {
            res.redirect(
              req.get("referer"),
              req,
              res,
              "Request succeed",
              apiResponse,
              true
            );
          })
          .catch((apiError) =>
            renderErrorVue("index", req, res, apiError, "Request failed")
          );
      }
    );

    // ****************************************************
    // @desc    Update for endpoints
    // @route   POST /backend/:endpoint/:id/update
    // @access  Private
    // ****************************************************

    this.router.post(
      "/:endpoint/:id/update",
      this.passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/",
      }),
      (req, res) => {
        // Check body data
        if (
          typeof req.body === "undefined" ||
          req.body === null ||
          Object.keys(req.body).length === 0
        ) {
          return renderErrorVue(
            "index",
            req,
            res,
            "No data provided",
            "Request failed"
          );
        }
        // Check body data
        const { ok, extra, miss } = checkFields(
          Mandatory[req.params.endpoint],
          req.body
        );

        // Error: bad fields provided
        if (!ok) {
          return renderErrorVue(
            "index",
            `/${req.params.endpoint}`,
            "POST",
            res,
            "Bad fields provided",
            { extra, miss }
          );
        }

        Controllers[req.params.endpoint]
          .updateOne(req)
          .then((apiResponse) => {
            res.redirect(
              req.get("referer"),
              req,
              res,
              "Request succeed",
              apiResponse,
              true
            );
          })
          .catch((apiError) =>
            renderErrorVue("index", req, res, apiError, "Request failed")
          );
      }
    );

    // ****************************************************
    // @desc    Delete for endpoints
    // @route   POST /backend/:endpoint/:id/delete
    // @access  Private
    // ****************************************************

    this.router.post(
      "/:endpoint/:id/delete",
      this.passport.authenticate("jwt", {
        session: false,
        failureRedirect: "/",
      }),
      (req, res) => {
        Controllers[req.params.endpoint]
          .deleteOne(req)
          .then((apiResponse) => {
            res.redirect("/", req, res, "Request succeed", apiResponse, true);
          })
          .catch((apiError) =>
            renderErrorVue("index", req, res, apiError, "Request failed")
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
module.exports = BackendRouter;
//
