const User = require("../models/user");
exports.form = (req, res) => {
  res.render(`register`, {});
};
exports.submit = (req, res, next) => {
  User.findByEmail(req.body.dataForm.email, (err, user) => {
    const email = req.body.user.email;
    if (err) return next(err);
    if (user) {
      res.error("Пользователь с таким email уже существует");
    } else {
      User.create(req.body.user, (err) => {
        if (err) return next(err);
      });
    }
    res.redirect("/");
  });
};
