// server.js

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { logger } = require("./src/middleware/winston.middleware");
const { dbConnection } = require("./src/db/config");

const app = express();
const server = http.createServer(app);
// Create a Socket.io instance with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://watch-n-chat-fe.vercel.app/"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
const PORT = process.env.PORT || 5000;
// Use cors middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://watch-n-chat-fe.vercel.app/"],
  })
);
// Connect to MongoDB
dbConnection()
  .then(() => {
    logger.info("MongoDB connected");
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err);
  });

// Define Comment schema
const commentSchema = new mongoose.Schema({
  text: String,
  timestamp: Number,
});

// Define Comment model
const Comment = mongoose.model("Comment", commentSchema);

// WebSocket handling
io.on("connection", (socket) => {
  logger.info("A user connected");

  socket.on("createComment", async (data) => {
    try {
      const newComment = new Comment(data);
      await newComment.save();
      io.emit("newComment", newComment);
    } catch (err) {
      logger.error("Error creating comment:", err);
    }
  });

  socket.on("disconnect", () => {
    logger.info("A user disconnected");
  });
});
// Route to fetch comments based on timestamp
app.get("/comments", async (req, res) => {
  try {
    const { timestamp } = req.query;
    const comments = await Comment.find({ timestamp: timestamp });
    res.json(comments);
  } catch (err) {
    logger.error("Error fetching comments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
