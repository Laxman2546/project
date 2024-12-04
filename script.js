const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userModel = require("./models/user");
const profileModel = require("./models/profile");
const bcrypt = require("bcrypt");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { log } = require("console");
const env = require("dotenv").config();

if (env.error) {
  console.log("failed at env");
}

const app = express();

// Middleware setup
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser()); // Ensure cookie-parser is used correctly

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

// Routes
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/courses", isloggedin, (req, res) => {
  res.render("courses", { user: req.user });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
  });
  res.redirect("/");
});

// Profile routes
app.get("/profile", isloggedin, async (req, res) => {
  try {
    const profile = await userModel.findOne({ email: req.user.email });

    if (profile && profile.profileImage && profile.profileImage.data) {
      // If the user has a profile image, convert it to a base64 string
      profile.profileImage.data = `data:${
        profile.profileImage.contentType
      };base64,${profile.profileImage.data.toString("base64")}`;
    } else {
      // Fallback to a default image path if no profile image is found
      profile.profileImage = {
        data: "/images/default.png", // Static image path
      };
    }

    res.render("profile", { user: profile });
  } catch (err) {
    console.error("Error retrieving profile:", err);
    res.status(500).send("Error retrieving profile.");
  }
});

// Authentication middleware
function isloggedin(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/"); // Redirect if no token found
  } else {
    try {
      const data = jwt.verify(token, process.env.SECRET_KEY);
      req.user = data;
      next();
    } catch (err) {
      console.log("JWT verification failed:", err);
      res.redirect("/"); // Redirect if token verification fails
    }
  }
}
app.get("/update", isloggedin, async (req, res) => {
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { email: "harika@gmail.com" },
      { $set: { username: "nani" } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found.");
    }

    res.send(updatedUser); // Send the updated user details as response
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("An error occurred while updating the user.");
  }
});

// Profile update route
app.get("/profile", isloggedin, async (req, res) => {
  const { username, address } = req.body;
  const { email } = req.user;
  try {
    const profile = await userModel.findOne({ email: email });

    // Check if profile is found
    if (!profile) {
      return res.status(404).send("Profile not found");
    }

    // Convert profileImage to base64 if it exists
    if (profile.profileImage && profile.profileImage.data) {
      profile.profileImage.data = `data:${
        profile.profileImage.contentType
      };base64,${profile.profileImage.data.toString("base64")}`;
    } else {
      profile.profileImage = { data: "/images/default.png" }; // Fallback to default image
    }
    // Render profile page with user data
    res.render("profile", { user: profile });
  } catch (err) {
    console.error("Error retrieving profile:", err);
    res.status(500).send("Error retrieving profile.");
  }
});

app.post(
  "/profile/update",
  isloggedin,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { username, address, occupation } = req.body;
      const { email } = req.user;
      const updateData = { username, address, occupation };

      // If an image is uploaded, add it to the update data
      if (req.file) {
        updateData.profileImage = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      // Update user in the database
      const updatedUser = await userModel.findOneAndUpdate(
        { email },
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found.");
      }

      res.redirect("/profile");
    } catch (err) {
      res.status(500).send("An error occurred while updating the profile.");
    }
  }
);

// Register a new user
app.post("/create", async (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return res.status(500).send("Error generating salt");
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        return res.status(500).send("Error hashing password");
      }
      const userEmail = await userModel.findOne({ email });
      if (!userEmail) {
        try {
          const user = await userModel.create({
            username,
            email,
            password: hash,
          });

          const token = jwt.sign({ email, username }, process.env.SECRET_KEY);
          console.log("Token:", token);
          console.log("Secret used for verification:", process.env.SECRET_KEY);
          res.cookie("token", token, { httpOnly: true, path: "/" });
          res.redirect("/courses");
        } catch (err) {
          res.status(500).send("Error saving user: " + err.message);
        }
      } else {
        res.send("user already exists");
      }
    });
  });
});

// Login route
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

      const token = jwt.sign(
        { email, username: user.username },
        process.env.SECRET_KEY
      ); // Add username to the payload

      res.cookie("token", token, { httpOnly: true, path: "/" });
      res.redirect("/courses");
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message); // Log the error for debugging
  res.status(500).send("Something went wrong!"); // General message for users
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
