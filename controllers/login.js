const User = require("../models/user");
exports.form = (req, res) => {
  res.render("loginForm", { title: "Login" });
};
exports.submit = (req, res, next) => {
  User.authentificate(req.body.loginForm, (err, data) => {
    if (err) return next(err);
    if (!data) {
      console.log("имя или пароль неверны");
      res.redirect("back");
    }
    if (data) {
      req.session.userEmail = data.email;
      req.session.userName = data.name;
      res.redirect("/");
    }
  });
};
exports.logout = function (req, res, next) {
  req.session.destroy((err) => {
    if (err) return nexn(err);
    res.redirect("/");
  });
};
