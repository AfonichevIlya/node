const express = require("express");
const router = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const entries = require("../controllers/entries");
const validatePassword = require("../middleWare/pass_validation");
const User = require("../models/user");
const timeSince = require("../middleware/timeSince"); 
const multer = require("multer");
const path = require("path");
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
      res.locals.user = null; 
      res.redirect("/");
    });
  } else {
    res.locals.user = null;
    res.redirect("/");
  }
});
router.get("/guest", (req, res) => {
  User.createGuest((error, guestUser) => {
    if (error) {
      console.error("Error creating guest user:", error);
      return res.redirect("/register");
    }

    
    req.session.userEmail = guestUser.email;
    req.session.userName = guestUser.name;
    req.session.isGuest = true;
    res.redirect("/"); /
  });
});
router.get("/profile", (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect("/login");
  }

  User.findByEmail(req.session.userEmail, (err, user) => {
    if (err || !user) {
      res
        .status(500)
        .send("Произошла ошибка при получении информации о пользователе");
    } else {
      res.render("profile", { title: "Профиль", user: user });
    }
  });
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatars/"); 
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post("/profile", upload.single("avatar"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("Нет файла для загрузки");
  }
});
router.post("/profile/avatar", upload.single("avatar"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("Нет файла для загрузки.");
  }

  const avatarPath = req.file.filename;

  User.updateAvatar(req.session.userEmail, avatarPath, (err) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send("Ошибка при обновлении аватара пользователя.");
    } else {
      return res.redirect("/profile");
    }
  });
});
module.exports = router;
