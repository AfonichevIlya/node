const express = require("express");
const router = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const entries = require("../controllers/entries");
const validatePassword = require("../middleWare/pass_validation");
const User = require("../models/user");
const timeSince = require("../middleware/timeSince"); // Adjust the path to wherever your timeSince.js file is located
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
    cb(null, "public/avatars/"); // Указываем папку для загрузки
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Добавьте маршрут на POST запрос для загрузки аватара
router.post("/profile", upload.single("avatar"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("Нет файла для загрузки");
  }
});
router.post("/profile/avatar", upload.single("avatar"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("Нет файла для загрузки.");
  }

  // Получаем путь к загруженному аватару
  const avatarPath = req.file.filename;

  // Предполагаем, что функция User.updateAvatar принимает email пользователя, путь к новому аватару и коллбэк
  User.updateAvatar(req.session.userEmail, avatarPath, (err) => {
    if (err) {
      // Обработаем ошибку, если что-то пошло не так
      console.error(err);
      return res
        .status(500)
        .send("Ошибка при обновлении аватара пользователя.");
    } else {
      // Если все прошло успешно, перенаправляем пользователя на страницу профиля
      return res.redirect("/profile");
    }
  });
});
module.exports = router;
