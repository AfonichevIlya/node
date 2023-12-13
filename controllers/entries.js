const Entry = require("../models/entry");
exports.list = (req, res, next) => {
  Entry.selectAll((err, entries) => {
    if (err) return next(err);
    res.render("entries", { title: "list", entries: entries });
  });

  exports.form = (req, res, next) => {
    res.render("post", { title: "Post" });
  };
  exports.submit = (req, res, next) => {
    try {
      const username = req.user ? req.user.name : null;
      const data = req.body.entry;
      const entry = {
        username: username,
        title: data.title,
        content: data.content,
      };
      Entry.create(entry);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  };
};
