const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Sau tiên tố /api/auth, nếu phần còn lại của URL là /profile
// Thì chạy middleware protect để xác thực user
// Nếu pass thì chuyển → sang getUserProfile để xử lý và trả về response
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
