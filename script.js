const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); // Use correct naming and import

const app = express();

// Middleware setup
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser()); // Ensure cookie-parser is used correctly

// Routes
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Route to delete a user by email
app.get("/delete", async (req, res) => {
  const result = await userModel.deleteOne({ email: "unix@gmail.com" });
  if (result.deletedCount === 0) {
    return res.status(404).send("User not found");
  }
  res.send("User deleted successfully");
});

app.get("/courses", isloggedin, (req, res) => {
  res.render("courses");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
  });
  res.redirect("/");
});

function isloggedin(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/");
  }
  next();
}

// Register a new user
app.post("/create", async (req, res) => {
  const { email, password, confirmpassword } = req.body;

  if (password !== confirmpassword) {
    return res.status(400).send("Passwords do not match");
  }

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return res.status(500).send("Error generating salt");
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        return res.status(500).send("Error hashing password");
      }
      try {
        const user = await userModel.create({
          email,
          password: hash,
        });

        const token = jwt.sign({ email }, "shhhh");
        res.cookie("token", token, { httpOnly: true, path: "/" });
        res.redirect("/courses");
      } catch (err) {
        res.status(500).send("Error saving user: " + err.message);
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
      res.cookie("token", token, { httpOnly: true, path: "/" });
      res.redirect("/courses");
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
