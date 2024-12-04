const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // If using GridFS
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Image", imageSchema);
