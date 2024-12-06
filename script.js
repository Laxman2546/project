const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const flash = require("connect-flash");
const session = require("express-session");
require("dotenv").config(); // Load environment variables

const userModel = require("./models/user");

// Initialize Express
const app = express();

// Middleware setup
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(file.originalname.toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, or .png files are allowed!"));
    }
  },
});

// Authentication middleware
function isloggedin(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/");
  }
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    req.user = data;
    next();
  } catch (err) {
    console.log("JWT verification failed:", err);
    req.flash("error", "Invalid or expired session. Please log in again.");
    res.redirect("/");
  }
}

// Routes
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Course route (GET)
app.get("/courses", isloggedin, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }

    if (user.profileImage && user.profileImage.data) {
      user.profileImage.data = `data:${
        user.profileImage.contentType
      };base64,${user.profileImage.data.toString("base64")}`;
    } else {
      user.profileImage = { data: "/images/default.png" };
    }

    res.render("courses", { user });
  } catch (err) {
    console.error("Error fetching user data:", err);
    req.flash("error", "An error occurred while loading courses.");
    res.redirect("/");
  }
});

app.get("/profile", isloggedin, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/");
    }

    if (user.profileImage && user.profileImage.data) {
      user.profileImage.data = `data:${
        user.profileImage.contentType
      };base64,${user.profileImage.data.toString("base64")}`;
    } else {
      user.profileImage = { data: "/images/default.png" };
    }

    res.render("profile", { user });
  } catch (err) {
    console.error("Error retrieving profile:", err);
    req.flash("error", "An error occurred while loading the profile.");
    res.redirect("/");
  }
});

// Profile update route
app.post(
  "/profile/update",
  isloggedin,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { username, address, occupation } = req.body;
      const { email } = req.user; // User's email from the auth middleware

      const updateData = { username, address, occupation };

      // Add profile image if uploaded
      if (req.file) {
        updateData.profileImage = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      // Check if the username is already taken by another user
      const existingUsername = await userModel.findOne({
        username,
        email: { $ne: email }, 
      });

      if (existingUsername) {
        req.flash("error", "Username already exists try another!");
        return res.redirect("/profile");
      }

    
      const updatedUser = await userModel.findOneAndUpdate(
        { email }, 
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        req.flash("error", "User not found. Unable to update profile.");
        return res.redirect("/profile");
      }

      // Successful update
      req.flash("success", "Profile updated successfully!");
      res.redirect("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      req.flash(
        "error",
        "An unexpected error occurred while updating the profile."
      );
      res.redirect("/profile");
    }
  }
);

// Register a new user
app.post("/create", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error", "User already exists. Try logging in.");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, secure: false });
    req.flash("success", "Registration successful!");
    res.redirect("/courses");
  } catch (err) {
    console.error("Error during registration:", err);
    req.flash("error", "An error occurred during registration.");
    res.redirect("/register");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/");
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, secure: false });
    req.flash("success", "Login successful!");
    res.redirect("/courses");
  } catch (err) {
    console.error("Error during login:", err);
    req.flash("error", "An error occurred during login.");
    res.redirect("/");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  req.flash("success", "Logged out successfully.");
  res.redirect("/");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
