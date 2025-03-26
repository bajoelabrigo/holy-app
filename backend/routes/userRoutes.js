import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  getUsers,
  loginStatus,
  upgradeUser,
  sendAutomatedEmail,
  deleteUser,
  sendVerificationEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
  changePassword,
  sendLoginCode,
  loginWithCode,
  loginWithGoogle,
  getSuggestedConnections,
  getUserProfile,
  getPublicProfile,
  getUsersForSidebar,
  updateProfile,
} from "../controllers/userController.js";
import {
  protect,
  adminOnly,
  authorOnly,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/getUser", protect, getUser);
router.patch("/updateUser", protect, updateUser);

router.delete("/:id", protect, adminOnly, deleteUser);
router.get("/getUsers", protect, authorOnly, getUsers);
router.get("/loginStatus", loginStatus);
router.post("/upgradeUser", protect, adminOnly, upgradeUser);
router.post("/sendAutomatedEmail", protect, sendAutomatedEmail);

router.post("/sendVerificationEmail", protect, sendVerificationEmail);
router.patch("/verifyUser/:verificationToken", verifyUser);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);
router.patch("/changePassword/", protect, changePassword);

router.post("/sendLoginCode/:email", sendLoginCode);
router.post("/loginWithCode/:email", loginWithCode);

router.post("/google/callback", loginWithGoogle);

//!Linkedin Clone
router.get("/profile/:username", getUserProfile);
router.get("/suggestions", protect, getSuggestedConnections);
router.get("/:username", protect, getPublicProfile);

router.get("/", protect, getUsersForSidebar);

router.put("/profile", protect, updateProfile);

export default router;
