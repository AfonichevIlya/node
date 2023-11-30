const User = require("../models/user");
exports.form = (req, res) => {
  res.render(`register`, {});
};
exports.submit = (req, res, next) => {
  User.create(req.body.user, cb);
};
