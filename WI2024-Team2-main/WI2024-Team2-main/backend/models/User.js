const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  experience: { type: String },
});

module.exports = mongoose.model("Profile", ProfileSchema);
