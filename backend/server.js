const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

let roomID = 1; // Shared room ID variable
const activeRooms = {};

// Auto-generate a nickname (G1, G2, G3, G4)
function generateNickname(room) {
  const takenNicknames = Object.values(room.participants).map(
    (p) => p.nickname
  );
  for (let i = 1; i <= 4; i++) {
    const nickname = `G${i}`;
    if (!takenNicknames.includes(nickname)) {
      return nickname;
    }
  }
  return null; // No available nickname
}

io.on("connection", (socket) => {
  let currentRoom = null;

  socket.on("createRoom", () => {
    const newRoomID = roomID++; // Increment and assign new room ID
    const room = {
      roomID: newRoomID,
      participants: {},
    };
    activeRooms[newRoomID] = room;
    currentRoom = room;

    socket.join(`room-${newRoomID}`);
    socket.emit("roomCreated", { roomID: newRoomID });

    // Automatically join the room after creating it
    joinRoom(socket, newRoomID);
    console.log("room create: " + roomID);
  });

  socket.on("joinRoom", (roomID) => {
    console.log("join Request");
    if (activeRooms[roomID]) {
      joinRoom(socket, roomID);
    } else {
      socket.emit("roomNotFound");
      console.log("room not found");
    }
  });

  socket.on("chat message", (data) => {
    if (currentRoom) {
      const { sender, message } = data;
      const roomID = currentRoom.roomID;
      const senderNickname = currentRoom.participants[socket.id].nickname;

      // Send the message to the receiver
      io.to(`room-${roomID}`).emit("chat message", {
        sender: senderNickname,
        message,
      });
    }
  });

  socket.on("typing", (data) => {
    if (currentRoom) {
      const { sender } = data;
      const roomID = currentRoom.roomID;

      socket.to(`room-${roomID}`).emit("typing", { sender });
    }
  });

  socket.on("disconnect", () => {
    if (currentRoom) {
      const roomID = currentRoom.roomID;
      delete currentRoom.participants[socket.id];
      socket.leave(`room-${roomID}`);
      io.to(`room-${roomID}`).emit(
        "participantList",
        Object.values(currentRoom.participants)
      );
      if (Object.keys(currentRoom.participants).length === 0) {
        delete activeRooms[roomID];
      }
      currentRoom = null;
    }
  });

  // Helper function to join a room
  function joinRoom(socket, roomID) {
    const room = activeRooms[roomID];
    if (room) {
      const nickname = generateNickname(room);
      if (nickname) {
        room.participants[socket.id] = { nickname };
        currentRoom = room;

        socket.join(`room-${roomID}`);
        socket.emit("roomJoined", { roomID, nickname });

        // Notify other participants about the new participant
        socket.to(`room-${roomID}`).emit("participantJoined", { nickname });
        console.log("room join: " + roomID + " nickname: " + nickname);
      } else {
        socket.emit("roomFull");
        console.log("room full");
      }
    }
    console.log(activeRooms);
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
