import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import cors from "cors";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/errorMiddleware.js";
import logger from "./config/logger.config.js";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/media/postRoutes.js";
import notificationRoutes from "./routes/media/notifications.js";
import connectionRoutes from "./routes/media/connection.js";
import messageRoutes from "./routes/chat/messajesRoutes.js";
import activityRoutes from "./routes/spiritualActivities/espiritualActivitiesRoutes.js";
import bibleRoutes from "./routes/bible/bibleRoutes.js"

import { app, server } from "./lib/socket.js";

//dotenv config
dotenv.config();

//Morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//Helmet
app.use(helmet()); //segurity

//parse json
app.use(express.json({ limit: "10mb" }));

//parse urlencoded
app.use(express.urlencoded({ extended: false }));

//sanitize request data
app.use(mongoSanitize());

//Enable cookie parser
app.use(cookieParser());

//compression
app.use(compression());

//file upload
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

//error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    success: false,
    status: err.status || 500,
    message: err.message,
  });
});

//Routes
app.use("/api/users", userRoutes);
//Social media
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/connections", connectionRoutes);
//Chat
app.use("/api/messages", messageRoutes);

//Spiritual Activities
app.use("/api/activities", activityRoutes);

//Bible
app.use('/api/bible', bibleRoutes);

//Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

//exit on mongo error
mongoose.connection.on("error", (err) => {
  logger.error(err);
  process.exit(1);
});

//mongo debug mode
if (process.env.NODE_ENV === "production") {
  mongoose.set("debug", true);
}

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    logger.info("DB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

server.listen(PORT, () => {
  logger.info(`Server is running in port ${PORT}`);
});
