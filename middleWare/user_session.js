const User = require("../models/user");

module.exports = function (req, res, next) {
  // Если пользователь ранее выбрал продолжить как гость
  if (req.session.isGuest) {
    req.user = {
      email: "guest@example.com",
      name: "гость",
      role: "guest",
    };
    res.locals.user = req.user; // делаем этот выбор доступным в шаблонах
    return next();
  }

  // Если в сессии есть информация о пользователе
  if (req.session.userEmail) {
    User.findByEmail(req.session.userEmail, (error, user) => {
      if (error) return next(error);

      // Если пользователь найден в базе данных
      if (user) {
        req.user = user;
      } else {
        // Если в базе данных нет пользователя с такой электронной почтой
        // можно либо создать пользователя, либо обработать этот случай
        req.session.destroy(); //может быть, вы захотите очистить сессию
        req.user = undefined;
      }
      res.locals.user = req.user; // делаем этот выбор доступным в шаблонах
      return next();
    });
  } else {
    // Если сессия не указывает, что пользователь гость и не содержит данные пользователя
    // не назначаем req.user и res.locals.user и просто переходим к следующему middleware
    return next();
  }
};
