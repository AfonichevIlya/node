const Entry = require("../models/entry");
const path = require("path");
const timeSince = require("../middleware/timeSince");
exports.list = (req, res, next) => {
  Entry.selectAll((err, entries) => {
    if (err) return next(err);

    const userData = req.user;
    // Include the timeSince utility function when rendering the template
    res.render("entries", {
      title: "List",
      entries: entries,
      user: userData,
      timeSince: timeSince, // pass the function to EJS context
    });
  });
};

exports.form = (req, res) => {
  res.render("post", { title: "Post" });
};
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

exports.submit = (req, res, next) => {
  const uploadSingle = upload.single("image");

  // Middleware - handle the file upload
  uploadSingle(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return next(err);
    }

    // If everything went fine, continue with your route function
    try {
      const username = req.user ? req.user.name : null;
      const data = req.body.entry;
      // Make sure you only save the filename, not the full path
      const imageFileName = req.file ? req.file.filename : null;

      // Replace the original call to Entry.create here with the new entry variable
      const entry = {
        username: username,
        title: data.title,
        content: data.content,
        image: imageFileName, // Only the filename
      };

      Entry.create(entry, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    } catch (err) {
      return next(err);
    }
  });
};
exports.delete = (req, res, next) => {
  const entryId = req.params.id;

  Entry.delete(entryId, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.updateForm = (req, res) => {
  const entryId = req.params.id;
  Entry.getEntryById(entryId, (err, entry) => {
    if (err) {
      return res.redirect("/");
    }
    res.render("update", { title: "Update", entry: entry });
  });
};

exports.updateSubmit = (req, res, next) => {
  const entryId = req.params.id;
  const newData = {
    title: req.body.entry.title,
    content: req.body.entry.content,
  };

  Entry.update(entryId, newData, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
