const sqlite = require("sqlite3").verbose();
const db = new sqlite3.Database("test.sqlite");
const bcrypt = require("bcrypt");
const sql =
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, password TEXT NOT NULL, age INTEGER NOT NULL, name TEXT NOT NULL)";

db.run(sql);
class User {
  constructor() {}

  static async create(dataform, cb) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(dataform.password, salt);
      const sql1 = "INSERT INTO user (email, password, age) VALUES(?,?,?)";
      db.run(sql1, dataform.email, hash, dataform.age, cb);
    } catch (err) {
      if (err) return next(err);
    }
  }

  static findByEmail(email, cb) {
    db.get("SELECT * FROM users WHERE email = ?", email, cb);
  }
  static authentificate(dataform, cb) {
    User.findByEmail(dataform.email, cb),
      (err, user) => {
        if (err) return cb(err);
        if (!user) return cb();
      };
    const result = bcrypt.compare(dataform.password, user.password);
    if (result) return cb(user); // TODO: check
  }
}
