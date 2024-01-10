const express = require("express");
const router = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const entries = require("../controllers/entries");
const validatePassword = require("../middleware/pass_validation");
const User = require("../models/user");
const timeSince = require("../middleware/timeSince"); // Adjust the path to wherever your timeSince.js file is located

router.get("/", entries.list);

router.get("/post", entries.form);
router.post("/post", (req, res, next) => {
  if (req.user.role === "guest") {
    return res.status(403).send("Guests cannot post.");
  }
  entries.submit(req, res, next);
});

router.get("/update/:id", entries.updateForm);
router.post("/update/:id", entries.updateSubmit);

router.delete("/:id", (req, res, next) => {
  if (req.user.role === "guest") {
    return res.status(403).send("Guests cannot delete posts.");
  }
  entries.delete(req, res, next);
});

router.get("/register", register.form);
router.post("/register", validatePassword, register.submit);

router.get("/login", login.form);
router.post("/login", login.submit);
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.locals.user = null; // Clear user from locals
      res.redirect("/");
    });
  } else {
    // If there's no session, just clear `locals.user` and redirect
    res.locals.user = null;
    res.redirect("/");
  }
});
router.get("/guest", (req, res) => {
  User.createGuest((error, guestUser) => {
    if (error) {
      // Handle error
      console.error("Error creating guest user:", error);
      return res.redirect("/register");
    }

    // Set guest details in the session
    req.session.userEmail = guestUser.email;
    req.session.userName = guestUser.name;
    req.session.isGuest = true; // Устанавливаем флаг isGuest в true
    res.redirect("/"); // Redirect the guest to homepage or wherever appropriate
  });
});

module.exports = router;
