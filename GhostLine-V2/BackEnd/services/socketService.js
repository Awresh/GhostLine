const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const logger = require("../utils/logger");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// To store user-specific sockets (Reverse mapping for efficiency)
const userSockets = new Map(); // Key: socket.id, Value: userId

io.on("connection", (socket) => {
logger.info("socket connected")
console.log("dsfhshfgshg")
  // Listen for user identification (e.g., login or join event)
  socket.on("identify", (userId) => {
    userSockets.set(socket.id, userId);  // Store userId against socket.id
    console.log(`User ${userId} identified with socket ID: ${socket.id}`);
    
    // Optionally, join a room for the user
    socket.join(userId);
  });

  // Listen for private messages
  socket.on("private_message", ({ toUserId, message }) => {
    // Find the target user's socket ID using userSockets map
    const targetSocketId = [...userSockets.entries()].find(([socketId, userId]) => userId === toUserId)?.[0];

    if (targetSocketId) {
      io.to(targetSocketId).emit("private_message", { message });
    } else {
      // Handle case where target user is not found (user not connected)
      socket.emit("private_message_error", { error: "User not found or disconnected." });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const userId = userSockets.get(socket.id);
    if (userId) {
      console.log(`User ${userId} disconnected`);
      userSockets.delete(socket.id);  // Remove user from map by socket.id
    }
  });

  // Handle reconnection
  socket.on('reconnect', () => {
    console.log(`User reconnected with socket ID: ${socket.id}`);
  });

  // Optionally, listen for reconnection attempts or errors
  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`Attempting to reconnect (Attempt #${attemptNumber})`);
  });

  socket.on('reconnect_error', (error) => {
    console.log(`Reconnection error: ${error}`);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
