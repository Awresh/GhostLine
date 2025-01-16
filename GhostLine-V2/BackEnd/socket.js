const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

// Secret key for JWT
const SECRET_KEY = 'ghotline1024690';

// Set up cookie-session middleware
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'], // Replace with your secret keys
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: false, // Use `true` in production with HTTPS
  })
);

// Initialize socket.io
const socketServer = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Maps for user sessions and rooms
  const userSockets = new Map(); // Key: userId, Value: socketId
  const activeRooms = {}; // Active rooms with participants
  const waitingUser = []; // Waiting users for matchmaking
  const matchedSocket = {}; // Matched sockets based on interests
  let roomID = 1001;

  // Middleware for session validation
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
console.log("token",token)
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      socket.user = decoded; // Attach user info to the socket
      console.log("decode",decoded)
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // Store user identification
    socket.on('identify', (userId) => {
      const token = jwt.sign({ userId }, SECRET_KEY);
      userSockets.set(userId, socket.id); // Map userId to socket ID
      socket.emit('session', { token }); // Send the token to the frontend
      console.log(`User ${userId} identified with session token.`);
    });

    // Match user with interest-based rooms
    socket.on('submitInterest', (data) => {
      const { userId, roomid, interests, token } = data;

      // Validate session token
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.userId !== userId) {
          return socket.emit('error', { message: 'Session validation failed' });
        }
      } catch (err) {
        return socket.emit('error', { message: 'Invalid session' });
      }

      console.log(`User ${userId} submitted interests:`, interests);

      if (roomid && activeRooms[roomid]) {
        // Join existing room
        if (!activeRooms[roomid].participants.includes(userId)) {
          activeRooms[roomid].participants.push(userId);
          socket.join(roomid);
          console.log('Updated participants in room:', activeRooms[roomid]);
        }
      } else {
        // Matchmaking logic
        const matchIndex = waitingUser.findIndex(
          (user) =>
            interests.some((interest) => user.interests.includes(interest)) &&
            !(matchedSocket[userId]?.includes(user.userId)) &&
            !(matchedSocket[user.userId]?.includes(userId)) &&
            userId !== user.userId
        );

        if (matchIndex !== -1) {
          // Match found
          const match = waitingUser[matchIndex];
          const room = {
            roomID: `room-${roomID++}`,
            participants: [userId, match.userId],
          };
          activeRooms[room.roomID] = room;

          socket.join(room.roomID); // Add current user to room
          const matchedSocketId = io.sockets.sockets.get(
            userSockets.get(match.userId)
          );
          if (matchedSocketId) {
            matchedSocketId.join(room.roomID);
          }

          console.log(`Room created: ${room.roomID} with users:`, room.participants);
          socket.emit('matchedInterests', { roomId: room.roomID, interests });
          if (matchedSocketId) {
            matchedSocketId.emit('matchedInterests', { roomId: room.roomID, interests });
          }

          waitingUser.splice(matchIndex, 1); // Remove matched user from waiting list
        } else {
          // Add user to waiting list
          waitingUser.push({ userId, interests, timestamp: Date.now() });
          console.log('Added to waiting list:', waitingUser);
        }
      }
    });

    // Handle private messaging
    socket.on('private_message', (data) => {
      const { toUserId, message } = data;

      const targetSocketId = userSockets.get(toUserId);
      if (targetSocketId) {
        socket.to(targetSocketId).emit('private_message', {
          from: socket.user.userId,
          message,
        });
        console.log('Private message sent to:', toUserId);
      } else {
        socket.emit('private_message_error', { error: 'User not found or disconnected.' });
        console.log('User not found:', toUserId);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const userId = socket.user?.userId;
      if (userId) {
        console.log(`User ${userId} disconnected`);
        userSockets.delete(userId);
      }
    });
  });
};

module.exports = { socketServer };
