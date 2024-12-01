const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/nani", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: {
    type: String,
    unique: true,
  },
  password: { type: String },
});

module.exports = mongoose.model("User", userSchema);
