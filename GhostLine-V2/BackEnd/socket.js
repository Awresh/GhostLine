const socketIo = require('socket.io');

const socketServer = (server) => {
  // Initialize socket.io with the server
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Handle new connections

  const userSockets = new Map(); // Key: socket.id, Value: userId 
  let activeRooms = {}; // match tow user then create room;  {roomID ,users=>[]} optional to make room group and one-one onther user join whith both permission
  let waitingUser = []; // wait user which is not match any {users => intrest,userID} wait only 3sec else contect tow user which completed our 3sec waitig
  let matchedSocket = {};    // intresed baseed match tow user data type [{}]
  let roomID = 1001;

  io.on("connection", (socket) => {
    console.log("check conection", socket.id)
    // Listen for user identification (e.g., login or join event)
    socket.on("identify", (userId) => {
      userSockets.set(userId, socket.id);  // Store userId against io.id
      console.log(`User ${userId} identified with io ID: ${socket.id}`);

      // Optionally, join a room for the user
      socket.join(userId);
      console.log(userSockets)
    });

    // match user with intrest based 
    socket.on('submitInterest', (userId, roomid, interests) => {
      console.log('Interests submitted:', interests);
    
      if (roomid && activeRooms[roomid] && !activeRooms[roomid].participants.includes(userId)) {
        // User wants to join an existing room
        activeRooms[roomid].participants.push(userId);
        socket.join(roomid);
        console.log("Updated participants in room:", activeRooms[roomid]);
      } else if (!roomid) {
        // Find a match in the waiting list
        const matchingInterestIndex = waitingUser.findIndex((user) => {
          return interests.some((interest) => user.interests.includes(interest)) &&
            !(matchedSocket[userId]?.includes(user.userId)) &&
            !(matchedSocket[user.userId]?.includes(userId)) &&
            userId !== user.userId;
        });
    
        if (matchingInterestIndex !== -1) {
          // Found a match
          const matchingUser = waitingUser[matchingInterestIndex];
    
          // Create matchedSocket relationships
          matchedSocket[userId] = matchedSocket[userId] || [];
          matchedSocket[userId].push(matchingUser.userId);
          matchedSocket[matchingUser.userId] = matchedSocket[matchingUser.userId] || [];
          matchedSocket[matchingUser.userId].push(userId);
    
          // Create a new room and add both users
          const room = {
            roomID: `room-${roomID}`,
            participants: [userId, matchingUser.userId],
          };
          activeRooms[room.roomID] = room;
    
          socket.join(room.roomID); // Current user joins the room
          const matchingUserSocket = io.sockets.sockets.get(userSockets.get(matchingUser.userId));
          if (matchingUserSocket) {
            matchingUserSocket.join(room.roomID); // Matched user joins the room
          }
    
          console.log(`Room created: ${room.roomID} with users:`, room.participants);
    
          // Notify both users about the match
          socket.emit('matchedInterests', { roomId: room.roomID, interests });
          if (matchingUserSocket) {
            matchingUserSocket.emit('matchedInterests', { roomId: room.roomID, interests });
          }
    
          // Remove matched user from waiting list
          waitingUser.splice(matchingInterestIndex, 1);
          roomID++; // Increment roomID for the next room
        } else {
          // Add user to the waiting list
          waitingUser.push({
            userId,
            interests,
            timestamp: Date.now(),
          });
          console.log("Added to waiting list:", waitingUser);
        }
      }
    });
    

    // Listen for private messages
    socket.on("private_message", (toUserId, message) => {
      // // Find the target user's socket ID
      // const targetSocketId = activeRooms[toUserId].participants
      // const userSocketsID = Object.fromEntries(userSockets)
      // console.log(activeRooms[toUserId], targetSocketId, userSocketsID)
      socket.to(`room-1001`).emit("private_message", {
        from: userSockets.get(socket.id), // Include sender's info
        message,
      });
      // if (targetSocketId) {
      //   // Send the message to the target user
       
      //   // targetSocketId.map((id) => {
      //   //   socket.to(`room-1001`).emit("private_message", {
      //   //     from: userSockets.get(socket.id), // Include sender's info
      //   //     message,
      //   //   });
      //   //   console.log("Message sent to:", userSocketsID[id]);
      //   // })

      // } else {
      //   // Target user not connected
      //   socket.emit("private_message_error", { error: "User not found or disconnected." });
      //   console.log("User not found:", toUserId);
      // }
    });


    // Handle user disconnection
    socket.on("disconnect", () => {
      const userId = userSockets.get(socket.id);
      if (userId) {
        console.log(`User ${userId} disconnected`);
        userSockets.delete(socket.id);  // Remove user from map by io.id

      }
    });

    // Handle reconnection
    socket.on('reconnect', () => {
      console.log(`User reconnected with io ID: ${socket.id}`);
    });

    // Optionally, listen for reconnection attempts or errors
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Attempting to reconnect (Attempt #${attemptNumber})`);
    });

    socket.on('reconnect_error', (error) => {
      console.log(`Reconnection error: ${error}`);
    });
  });
};
function joinRoom(socket, roomID, activeRooms, userId) {
  currentRoom = null;
  // console.log(roomID)
  console.log("activeroom chedck", activeRooms)
  const room = activeRooms[`${roomID}`];
  room.roomSocket = socket.id
  room.participants = [...room.participants, userId];
  socket.join(`room-1001`);
  // if (room) {
  //   const nickname = generateNickname(room);
    

  //   // if (nickname) {

  //   //   // currentRoom = room;
  //   //   // console.log(`room-${roomID}`);
  //   //   // socket.emit("roomJoined", { roomID, nickname });

  //   //   // Notify other participants about the new participant
  //   //   // socket.to(`room-${roomID}`).emit("participantJoined", { nickname });
  //   //   // console.log("room join: " + roomID + " nickname: " + nickname);
  //   //   // Check if there are other participants in the room
  //   //   // const numParticipants = Object.keys(room.participants).length;
  //   //   // if (numParticipants > 1) {
  //   //   //   // Emit an event to enable keyboard functionality
  //   //   //   socket.emit("enableKeyboard");
  //   //   //   console.log("Keyboard enabled for room: " + roomID);
  //   //   // }
  //   // } else {
  //   //   socket.emit("roomFull");
  //   //   console.log("room full");
  //   // }
  // }
  console.log("activeRooms2", activeRooms);
}


function removeSocketIDAfterDelay(socketID, matchedSocketID, matchedSocket, delay) {
  console.log("check remove")
  setTimeout(() => {
    console.log(`Removing ${matchedSocketID} from ${socketID} after ${delay / 1000} seconds.`);

    // Construct updated matchedSocket without the targeted socket IDs
    const updatedMatchedSocket = {};

    // Filter out the undefined properties before manipulating the object
    Object.keys(matchedSocket).forEach((key) => {
      if (matchedSocket[key]) {
        updatedMatchedSocket[key] = matchedSocket[key].filter(id => id !== matchedSocketID);
      }
    });
    Object.keys(matchedSocket).forEach(key => {
      if (matchedSocket[key] == undefined) {
        delete matchedSocket[key];
      }
    });


    // Update matchedSocketID's matchedSocket (reverse connection)
    // Check if the property exists and is not undefined before filtering
    if (updatedMatchedSocket[matchedSocketID] !== undefined) {
      updatedMatchedSocket[matchedSocketID] = updatedMatchedSocket[matchedSocketID].filter(id => id !== socketID);
    } else {
      console.log(`Property ${matchedSocketID} does not exist or is undefined.`);
    }


    // Update the original matchedSocket with the updated one
    Object.keys(matchedSocket).forEach((key) => {
      matchedSocket[key] = updatedMatchedSocket[key];
    });

    matchedSocket[matchedSocketID] = updatedMatchedSocket[matchedSocketID];
    matchedSocket[socketID] = updatedMatchedSocket[socketID];
    Object.keys(matchedSocket).forEach(key => {
      if (matchedSocket[key] == undefined) {
        delete matchedSocket[key];
      }
    });
    const matchedSocketArray = Object.entries(matchedSocket)
      .map(([key, value]) => [key, Array.isArray(value) ? value.slice() : value]);
    console.log('Matched Socket Data:', matchedSocketArray);

  }, delay);
}


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
module.exports = {
  socketServer
};
