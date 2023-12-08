const express = require("express");
const router = express.Router();
const register = require("../controllers/register");
const entries = require("../controllers/entries");

router.get("/", entries.list);
// router.post("/entry", entry.);

router.get("/login", function (req, res) {
  res.render("login.ejs");
});
router.post("/login", function (req, res) {});

router.get("/register", register.form);
router.post("/register", register.submit);

module.exports = router;
