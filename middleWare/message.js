module.exports = function (req, res, next) {
  res.message();
  res.error = (msg) => {
    return res.message(msg);
  };
  next();
};
