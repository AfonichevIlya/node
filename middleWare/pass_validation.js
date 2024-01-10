function validatePassword(req, res, next) {
  const { password } = req.body;

  if (password.length < 6) {
    return res.render("registerForm", {
      title: "Register",
      passwordError: "Пароль должен быть не менее 6 символов", // Ключ изменен на passwordError
    });
  }

  if (/[\u0400-\u04FF]+/.test(password)) {
    return res.render("registerForm", {
      title: "Register",
      passwordError: "Пароль не дожен содержать русские символы", // Ключ изменен на passwordError
    });
  }

  next();
}

module.exports = validatePassword;
