exports.list = (req, res, next) => {
  res.render("entries", { title: "Entries" });
};
