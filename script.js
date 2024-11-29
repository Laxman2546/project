const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

const app = express();

// Middleware setup
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("login"); // Create a "login.ejs" template
});
app.get("/register", (req, res) => {
  res.render("register"); // Create a "register.ejs" template
});
app.get("/delete", async (req, res) => {
  const result = await userModel.deleteOne({ email: "unix@gmail.com" });
  if (result.deletedCount === 0) {
    return res.status(404).send("User not found");
  }
});

app.post("/create", async (req, res) => {
  console.log(req.body);
  const { email, password, confirmpassword } = req.body;

  if (password !== confirmpassword) {
    return res.status(400).send("Passwords do not match");
  }
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async (err, hash) => {
      try {
        const user = await userModel.create({
          email,
          password: hash,
          confirmpassword: hash,
        });
        const token = jwt.sign({ email }, "shhhh");
        res.cookie("token", token, { httpOnly: true, secure: true });
        res.redirect("/");
      } catch (err) {
        res.send("Error saving user:", err);
        res.status(500).send("Internal Server Error");
      }
    });
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).send("Email or password incorrect");
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      if (!result) {
        return res.status(400).send("Email or password incorrect");
      }
      const token = jwt.sign({ email }, "shhhh");
      res.cookie("userToken", token);
      res.send("you are logged in");
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
