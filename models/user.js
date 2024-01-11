const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("test.sqlite");

const sql =
  "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, age INT NOT NULL, role TEXT DEFAULT 'user')";
db.run(sql);
class User {
  constructor() {}

  static createGuest(cb) {
    const guestData = {
      name: "гость",
      email: "guest@nomail.com",
      age: 0,
      role: "guest",
    };

    cb(null, guestData);
  }
  static create(dataForm, cb) {
    dataForm.role = dataForm.role || "user";
    const sql1 =
      "INSERT INTO users (name, email, password, age, role) VALUES (?, ?, ?, ?, ?)";
    db.run(
      sql1,
      dataForm.name,
      dataForm.email,
      dataForm.password,
      dataForm.age,
      dataForm.role,
      function (err) {
        cb(err, { ...dataForm, id: this.lastID });
      }
    );
  }

  static findByEmail(email, cb) {
    db.get("SELECT * FROM users WHERE email = ?", email, cb);
  }

  static authentificate(dataForm, cb) {
    User.findByEmail(dataForm.email, (error, user) => {
      if (error) return cb(error);
      if (!user) return cb();
      if (dataForm.password === user.password) {
        return cb(null, user);
      } else {
        cb();
      }
    });
  }
}

module.exports = User;
