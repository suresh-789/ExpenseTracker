const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
  updateUserProfile,
} = require("../controllers/authController");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getUser", protect, getUserInfo);

router.put("/update-profile", protect, updateUserProfile);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Check for HTTPS via X-Forwarded-Proto header (set by proxies like Render)
  // or use the request protocol
  const protocol = req.get("X-Forwarded-Proto") || req.protocol;
  const host = req.get("host");
  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
