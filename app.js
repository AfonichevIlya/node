const express = require("express");
const favicon = require("express-favicon");
const fs = require("fs");
const path = require("path");
const { nextTick } = require("process");
const ejs = require("ejs");
const session = require("express-session");
const message = require("./middleWare/message");
const userSession = require("./middleware/user_session");
const app = express();
const myRoutes = require("./routers/index_routers");
const port = "3000";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

console.log(app.get("env"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "views")));

app.use(
  session({
    secret: "aboba",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  "/css/bootstrap.css",
  express.static(
    path.join(
      __dirname,
      "public/css/bootstrap-5.3.2/dist/css/bootstrap.min.css"
    )
  )
);

app.use(favicon(__dirname + "/public/favicon.ico"));

app.use(message);
app.use(userSession);
app.use(myRoutes);

app.listen(port, () => {
  console.log(`listen on port ${port}`);
});

app.get("env") == "production";

if (app.get("env") == "production") {
  app.use((req, res, err) => {
    res.status(err.status);
    res.sendFile(err.message);
  });
}

if (app.get("env") != "development") {
  app.use(function (err, req, res, next) {
    console.log(err.status, err.message);
    res.status = 404;
    link = "https://centralsib.com/media/gallery/kukushka.jpg";
    res.render("error.ejs", { err, link });
  });
} else {
  app.use(function (err, req, res, next) {
    console.log(app.get("env"), err.status, err.message);
  });
}
