const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, immutable: true },
  address: { type: String },
  profileImage: {
    data: Buffer,
    contentType: String,
  },
});

// Middleware to sync username with User model
profileSchema.pre("save", async function (next) {
  if (this.isModified("username")) {
    const User = mongoose.model("User");
    await User.updateOne({ email: this.email }, { username: this.username });
  }
  next();
});

module.exports = mongoose.model("Profile", profileSchema);
