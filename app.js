const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(
    "mongodb+srv://deepaksehrawat150:7Okv6ePzLEqREYgE@cluster0.9jqfnbj.mongodb.net/",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Aman",
          email: "aman@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log("Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  User.findById("6665b05c9ea3f541000459a7")
    .then((user) => {
      if (!user) {
        console.error("User not found");
        return res.status(404).send("User not found");
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error("Database error:", err);
      res.status(500).send("Internal server error");
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
