import express from "express";
import trimRequest from "trim-request";
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
  updateProfile,
  searchUsers,
  checkAuth,
} from "../controllers/userController.js";
import {
  protect,
  adminOnly,
  authorOnly,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", trimRequest.all, registerUser);
router.post("/login", trimRequest.all, loginUser);
router.get("/logout", trimRequest.all, logoutUser);
router.get("/getUser", trimRequest.all, protect, getUser);
router.patch("/updateUser", trimRequest.all, protect, updateUser);

router.delete("/:id", trimRequest.all, protect, adminOnly, deleteUser);
router.get("/getUsers", trimRequest.all, protect, authorOnly, getUsers);
router.get("/loginStatus", trimRequest.all, loginStatus);
router.post("/upgradeUser", trimRequest.all, protect, adminOnly, upgradeUser);
router.post(
  "/sendAutomatedEmail",
  trimRequest.all,
  protect,
  sendAutomatedEmail
);

router.post(
  "/sendVerificationEmail",
  trimRequest.all,
  protect,
  sendVerificationEmail
);
router.patch("/verifyUser/:verificationToken", trimRequest.all, verifyUser);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:resetToken", trimRequest.all, resetPassword);
router.patch("/changePassword/", trimRequest.all, protect, changePassword);

router.post("/sendLoginCode/:email", trimRequest.all, sendLoginCode);
router.post("/loginWithCode/:email", trimRequest.all, loginWithCode);

router.post("/google/callback", trimRequest.all, loginWithGoogle);

//!Linkedin Clone
router.get("/profile/:username", trimRequest.all, getUserProfile);
router.get("/suggestions", trimRequest.all, protect, getSuggestedConnections);
router.get("/:username", trimRequest.all, protect, getPublicProfile);

router.put("/profile", trimRequest.all, protect, updateProfile);

router.get("/", trimRequest.all, protect, searchUsers);

router.get("/check", trimRequest.all, protect, checkAuth);

export default router;
