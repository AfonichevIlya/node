exports.getField = (field) => {
  let value;
  field.forEach((element) => {
    value = req.body(element);
  });
  return value;
};
function parseField(field) {
  return field.split(/\[|\]/).filter((s) => s);
}
exports.required = (field) => {
  return (req, res, next) => {
    if (getField(req, field)) {
      next();
    } else {
      res.error("Required");
      res.redirect("/back");
    }
  };
};
exports.lenghtAbove = (field, len) => {
  return (req, res, next) => {
    if (getField(req, field).lenght > len) {
      next();
    } else {
      res.error("Required");
      res.redirect("/back");
    }
  };
};
