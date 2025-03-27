import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken, hashToken } from "../utils/generateToken.js";
import { UAParser } from "ua-parser-js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Cryptr from "cryptr";
import Token from "../models/tokenModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";
import cloudinary from "../lib/cloudinary.js";

const cryptr = new Cryptr(`${process.env.CRYPTR_KEY}`);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//! Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  // Validation
  if (!name || !username || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all the required fields");
  }
  if (password < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  //Check if existing username
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(400).json({ message: "Username already exists" });
  }

  if (userExists) {
    res.status(400);
    throw new Error("Email already in use");
  }

  // Get Browser Agent
  const ua = UAParser(req.headers["user-agent"]);
  const userAgent = [ua.ua];

  // Create new user
  const user = await User.create({
    name,
    username,
    email,
    password,
    userAgent,
  });

  // Generate token
  const token = generateToken(user._id);

  //Send cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, username, email, phone, bio, photo, role, isVerified } =
      user;

    res.status(201).json({
      _id,
      name,
      email,
      username,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//!Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }

  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  // Trigger 2 factor for unknow UserAgent
  const ua = UAParser(req.headers["user-agent"]);
  const thisUserAgent = ua.ua;
  console.log(thisUserAgent);
  //Save UserAgent in DB
  const alowedAgent = user.userAgent.includes(thisUserAgent);

  //If userAgent is not saved in DB create 6 digit code  and send email
  if (!alowedAgent) {
    //Generate 6 digit code
    const loginCode = Math.floor(100000 + Math.random() * 900000);
    console.log(loginCode);

    //Encrypt login code before saving DB
    const encryptedLoginCode = cryptr.encrypt(loginCode.toString());

    //Delete Token if it exist in DB
    let userToken = await Token.findOne({ userId: user._id });
    if (userToken) {
      await userToken.deleteOne();
    }

    //save Token in DB
    await new Token({
      userId: user._id,
      lToken: encryptedLoginCode,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * (60 * 1000), //60 mins
    }).save();

    res.status(400);
    throw new Error(
      "New browser or device detected, Check your email for login code"
    );
  }

  //Generate Token
  const token = generateToken(user._id);

  if (user && passwordIsCorrect) {
    //Send Cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    const { _id, name, username, email, phone, bio, photo, role, isVerified } =
      user;

    res.status(200).json({
      _id,
      name,
      username,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
    });
  } else {
    res.status(500);
    throw new Error("Something went wrong, please try again");
  }
});

//!SEND LOGIN CODE
const sendLoginCode = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  //Find Login Code in DB
  let userToken = await Token.findOne({
    userId: user._id,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired token, please login again");
  }

  const loginCode = userToken.lToken;
  const decryptedLoginCode = cryptr.decrypt(loginCode);

  //Send Login Code
  const subject = "Login Access Code - YitoWeb";
  const send_to = email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "noreply@mail.com";
  const template = "loginCode";
  const name = user.name;
  const link = decryptedLoginCode;

  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ message: `Access code sent to ${email}` });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

//!LOGIN WITH CODE
const loginWithCode = asyncHandler(async (req, res) => {
  const { email } = req.params;
  const { loginCode } = req.body;

  //Email coming of DB
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  //Find user Login Token in DB
  const userToken = await Token.findOne({
    userId: user._id,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token, please login again");
  }

  //Decripted login code
  const decryptedLoginCode = cryptr.decrypt(userToken.lToken);

  if (loginCode !== decryptedLoginCode) {
    res.status(400);
    throw new Error("Incorrect login code, please try again");
  } else {
    //Register userAgent
    const ua = UAParser(req.headers["user-agent"]);
    const thisUserAgent = ua.ua;
    user.userAgent.push(thisUserAgent);
    console.log(thisUserAgent);
    await user.save();

    //Generate Token
    const token = generateToken(user._id);

    //Send Cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), //1Day
      sameSite: "none",
      secure: true,
    });

    const { _id, name, username, email, phone, bio, photo, role, isVerified } =
      user;

    res.status(200).json({
      _id,
      name,
      username,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
      token,
    });
  }
});

//!LOGIN WITH GOOGLE
const loginWithGoogle = asyncHandler(async (req, res) => {
  const { userToken } = req.body;
  // console.log(userToken)

  const ticket = await client.verifyIdToken({
    idToken: userToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { name, email, picture, sub } = payload;
  const password = Date.now() + sub;

  // Get UserAgent
  const ua = UAParser(req.headers["user-agent"]);
  const userAgent = [ua.ua];

  // Check if user exists
  const user = await User.findOne({ email });

  let createUsername = "username";

  if (!user) {
    //   Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      username: createUsername,
      profilePicture: picture,
      isVerified: true,
      userAgent,
    });

    if (newUser) {
      // Generate Token
      const token = generateToken(newUser._id);

      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });

      const {
        _id,
        name,
        username,
        email,
        phone,
        bio,
        profilePicture,
        role,
        isVerified,
      } = newUser;

      res.status(201).json({
        _id,
        name,
        username,
        email,
        phone,
        bio,
        profilePicture,
        role,
        isVerified,
        token,
      });
    }
  }

  // User exists, login
  if (user) {
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    const { _id, name, username, email, phone, bio, profilePicture, role, isVerified } =
      user;

    res.status(201).json({
      _id,
      name,
      username,
      email,
      phone,
      bio,
      profilePicture,
      role,
      isVerified,
      token,
    });
  }
});

//!Send Verification Email
const sendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  //Delete token if it exist en DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  //Create Verification Token and save
  const verificationToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(verificationToken);

  //Hash token and save
  const hashedToken = hashToken(verificationToken);

  await new Token({
    userId: user._id,
    vToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), //60mins
  }).save();

  //construct Verification URL
  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

  //Send Email
  const subject = "Verify Your Account - YitoWeb";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "noreply@yito.com";
  const template = "verifyEmail";
  const name = user.name;
  const link = verificationUrl;

  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ success: true, message: "Verification Email Send" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

//!Verify User
const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  const hashedToken = hashToken(verificationToken);

  const userToken = await Token.findOne({
    vToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  //Find User
  const user = await User.findOne({ _id: userToken.userId });

  if (user.isVerified) {
    res.status(400);
    throw new Error("User is already verified");
  }

  //Now verify user
  user.isVerified = true;
  await user.save();
  res
    .status(200)
    .json({ success: true, message: "Account Verification Successfull" });
});

//!Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logout successfully" });
});

//!Get User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const {
      _id,
      name,
      headline,
      about,
      location,
      profilePicture,
      bannerImg,
      skills,
      experience,
      education,
      username,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
    } = user;
    res.status(200).json({
      _id,
      name,
      headline,
      about,
      location,
      profilePicture,
      bannerImg,
      skills,
      experience,
      education,
      username,
      email,
      phone,
      bio,
      photo,
      role,
      isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//!Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, username, phone, bio, photo, role, isVerified } = user;

    user.email = req.body.email || email;
    user.name = req.body.name || name;
    user.username = req.body.username || username;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      username: updateUser.username,
      email: updateUser.email,
      phone: updateUser.phone,
      bio: updateUser.bio,
      photo: updateUser.photo,
      role: updateUser.role,
      isVerified: updateUser.isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//!Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: "User deleted succesfully",
  });
});

//!Get Users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort("-createdAt").select("-password");
  if (!users) {
    res.status(500);
    throw new Error("Something went wrong");
  }
  res.status(200).json(users);
});

//!Login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  // Verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

//!Upgrade User
//subscriber, author, and admin (suspended)
const upgradeUser = asyncHandler(async (req, res) => {
  const { role, id } = req.body;

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    message: `User role update to ${role}`,
  });
});

//!Send Automated Email
const sendAutomatedEmail = asyncHandler(async (req, res) => {
  const { subject, send_to, reply_to, template, url } = req.body;

  if (!subject || !send_to || !reply_to || !template) {
    res.status(500);
    throw new Error("Missing automated email parameter");
  }

  //Get User
  const user = await User.findOne({ email: send_to });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const sent_from = process.env.EMAIL_USER;
  const name = user.name;
  const link = `${process.env.FRONTEND_URL}${url}`;
  //const role = user.role

  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res.status(200).json({ success: true, message: "Email send!!!" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not send, please try again");
  }
});

//!FORGOT PASSWORD
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Email not found");
  }

  //Delete Token if it exist in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  //Create Reset Token and save in DB
  const resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  //Hash Token and save
  const hashedToken = hashToken(resetToken);

  await new Token({
    userId: user._id,
    rToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * (60 * 1000), //60mins
  }).save();

  //Construct URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

  //Send Email
  const subject = "Password reset request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "noreply@yito.com";
  const template = "forgotPassword";
  const name = user.name;
  const link = resetUrl;

  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

//!RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  console.log(resetToken);
  console.log(password);

  //Hash token in DB
  const hashedToken = hashToken(resetToken);

  //Find Token on DB
  const userToken = await Token.findOne({
    rToken: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired Token");
  }

  //Find User in Token Model
  const user = await User.findOne({ _id: userToken.userId });

  //Now reset password
  user.password = password;
  await user.save();

  //Send Email
  const subject = "Password Reset Successful - YitoWeb";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = "noreply@yito.com";
  const template = "passwordResetSuccessful";
  const name = user.name;
  const link = user.link;

  try {
    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link
    );
  } catch (error) {
    res.status(400).json({ message: "Email was not sent, try again" });
  }

  res.status(200).json({ message: "Password Reset Successful, please login" });
});

//!CHANGE PASSWORD
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, password } = req.body;
  const user = await User.findById(req.user._id);

  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Old and New password are required");
  }

  //Check if old password is correct
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Old and new password do not match, please try again");
  }

  //Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();

    //Send Email
    const subject = "Password Reset Successful - YitoWeb";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = "noreply@yito.com";
    const template = "passwordResetSuccessful";
    const name = user.name;
    const link = user.link;

    try {
      await sendEmail(
        subject,
        send_to,
        sent_from,
        reply_to,
        template,
        name,
        link
      );
      res
        .status(200)
        .json({ message: "Password change successful, please re-login" });
    } catch (error) {
      res.status(400).json({ message: "Email was not sent, try again" });
    }
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
});

const getSuggestedConnections = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id).select("connections");

  // find users who are not already connected, and also do not recommend our own profile!! right?
  const suggestedUser = await User.find({
    _id: {
      $ne: req.user._id, //no includes my own user
      $nin: currentUser.connections, // no includes user who are already connected
    },
  })
    .select("name username profilePicture headline")
    .limit(3);

  if (suggestedUser) {
    res.json(suggestedUser);
  } else {
    res.status(500).json({ message: "Server error" });
  }
});

const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select(
    "-password"
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user) {
    res.json(user);
  } else {
    res.status(500).json("Error in getPublicProfile", error);
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "username",
    "headline",
    "about",
    "location",
    "profilePicture",
    "bannerImg",
    "skills",
    "experience",
    "education",
  ];

  const updatedData = {};

  for (const field of allowedFields) {
    if (req.body[field]) {
      updatedData[field] = req.body[field];
    }
  }

  if (req.body.profilePicture) {
    const result = await cloudinary.uploader.upload(req.body.profilePicture);
    updatedData.profilePicture = result.secure_url;
  }

  if (req.body.bannerImg) {
    const result = await cloudinary.uploader.upload(req.body.bannerImg);
    updatedData.bannerImg = result.secure_url;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updatedData },
    { new: true }
  ).select("password");

  if (user) {
    res.json(user);
  } else {
    res.status(500).json({ message: "Server error" });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  // We will fetch user profile either with username or userId
  // query is either username or userId
  const { username } = req.params;

  const user = await User.findOne({ username })
    .select("-password")
    .select("updatedAt");
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user) {
    res.status(500);
  } else {
    throw new Error("Server error");
  }
});

const getUsersForSidebar = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");

  if (filteredUsers) {
    res.status(200).json(filteredUsers);
  } else {
    res.status(500);
    throw new Error("Error in getUserForSidebar controller");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  loginStatus,
  upgradeUser,
  sendAutomatedEmail,
  sendVerificationEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
  changePassword,
  sendLoginCode,
  loginWithCode,
  loginWithGoogle,
  //Linkedin Clone
  getSuggestedConnections,
  getUserProfile,
  getPublicProfile,
  getUsersForSidebar,
  updateProfile,
};
