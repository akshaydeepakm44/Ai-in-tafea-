const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Loads environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI; // Reads from .env file
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema and Model
const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  experience: String,
});
const Profile = mongoose.model("Profile", profileSchema);

// Routes
app.put("/api/profile", async (req, res) => {
  const { name, email, phone, experience } = req.body;

  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      {}, // Update query
      { name, email, phone, experience },
      { new: true, upsert: true }
    );
    res.status(200).json({ message: "Profile updated successfully", updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
