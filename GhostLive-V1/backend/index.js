const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const { connected } = require("process");

const app = express();
app.use(cors());
app.use(express.static("public"));

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

let roomID = 1001; // Shared room ID variable
const activeRooms = {};
let waitingUser = [];
let matchedSocket = {};
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


  socket.on('submitInterest', (interests) => {
    console.log('Interests submitted:', interests);
    // console.log(`activeRooms:${activeRooms}`);
    // Find the matching user based on interests and whether they are already matched
    const matchingInterestIndex = waitingUser.findIndex((user) => {
      return interests.some((interest) => user.interests.includes(interest)) &&
        !(matchedSocket[socket.id] && matchedSocket[socket.id].includes(user.socketID)) &&
        !(matchedSocket[user.socketID] && matchedSocket[user.socketID].includes(socket.id)) &&
        socket.id !== user.socketID;
    });


    if (matchingInterestIndex !== -1) {



      const matchedInterests = new Set();

      // Find users with matching interests and add them to the Set
      waitingUser.forEach((user) => {
        interests.forEach((interest) => {
          if (user.interests.includes(interest)) {
            matchedInterests.add(interest);
          }
        });
      });



      // Found a match, create a room and join both users
      const matchingUser = waitingUser[matchingInterestIndex];

      if (!matchedSocket[socket.id]) {
        matchedSocket[socket.id] = [];
      }
      matchedSocket[socket.id].push(matchingUser.socketID);

      if (!matchedSocket[matchingUser.socketID]) {
        matchedSocket[matchingUser.socketID] = [];
      }
      matchedSocket[matchingUser.socketID].push(socket.id);

      console.log(matchedSocket[socket.id]);
      console.log(matchedSocket[matchingUser.socketID]);


      // Set timeout to remove the socket ID after 3 minutes
      removeSocketIDAfterDelay(socket.id, matchingUser.socketID, 180000);
      const roomID = matchingUser.roomID;



      // Remove matched user from waiting list
      waitingUser.splice(matchingInterestIndex, 1);
      // Emit the matched interests (as an array) to the user who submitted the interests
      socket.to(matchingUser.socketID).emit('matchedInterests', Array.from(["You both like.", ...matchedInterests]));
      socket.emit('matchedInterests', Array.from(["You both like.", ...matchedInterests]));
      // Join current user to the matched room
      matchedSocket[socket.id].push(matchingUser.socketID);
      matchedSocket[matchingUser.socketID].push(socket.id);
      joinRoom(socket, roomID);
    } else {
      // No match found, create a new room for the current user
      roomID++;
      const newRoomID = roomID++;
      const room = {
        roomID: newRoomID,
        participants: {},
      };
      activeRooms[newRoomID] = room;

      // Join current user to the new room
      joinRoom(socket, newRoomID);

      // Push current user to waiting list with multiple interests
      waitingUser.push({
        socketID: socket.id,
        interests: interests,
        roomID: newRoomID,
        timestamp: Date.now(),// Add a timestamp when the user is pushed
      });
      //if two user are waiting max 2 second then match them eatch other and emmit interest no match found you got random ghots
    }
  });
  // Function to check for matches after a certain interval
  function checkForMatches() {
    const now = Date.now();
    const waitingLongEnough = waitingUser.filter(user => now - user.timestamp > 2000);

    if (waitingLongEnough.length >= 2) {
      // Shuffle the waiting users randomly
      const shuffledUsers = shuffle(waitingLongEnough);

      // Find a suitable pair of users based on conditions
      let user1, user2;
      let pairFound = false;

      for (let i = 0; i < shuffledUsers.length - 1; i++) {
        for (let j = i + 1; j < shuffledUsers.length; j++) {
          const potentialUser1 = shuffledUsers[i];
          const potentialUser2 = shuffledUsers[j];

          const user1AlreadyMatched = matchedSocket[potentialUser1.socketID] && matchedSocket[potentialUser1.socketID].includes(potentialUser2.socketID);
          const user2AlreadyMatched = matchedSocket[potentialUser2.socketID] && matchedSocket[potentialUser2.socketID].includes(potentialUser1.socketID);
          const notSameUser = potentialUser1.socketID !== potentialUser2.socketID;

          if (!user1AlreadyMatched && !user2AlreadyMatched && notSameUser) {
            user1 = potentialUser1;
            user2 = potentialUser2;
            pairFound = true;
            break;
          }
        }
        if (pairFound) break;
      }

      if (pairFound) {
        // Remove matched users from waiting list
        waitingUser = waitingUser.filter(user => user !== user1 && user !== user2);
        // Get rooms of both users
        const roomToLeave1 = Object.keys(activeRooms).find(roomID => activeRooms[roomID].participants.hasOwnProperty(user1.socketID));
        const roomToLeave2 = Object.keys(activeRooms).find(roomID => activeRooms[roomID].participants.hasOwnProperty(user2.socketID));

        // Leave rooms for both users
        leaveRoom(user1.socketID, roomToLeave1, io);
        leaveRoom(user2.socketID, roomToLeave2, io);

        // Create a new room for the matched users
        const newRoomID = roomID++;
        const room = {
          roomID: newRoomID,
          participants: {},
        };
        activeRooms[newRoomID] = room;

        // Join users to the new room using their socket instances
        const socket1 = io.sockets.sockets.get(user1.socketID);
        const socket2 = io.sockets.sockets.get(user2.socketID);
        joinRoom(socket1, newRoomID);
        joinRoom(socket2, newRoomID);
        // Store matching information
        if (!matchedSocket[user1.socketID]) {
          matchedSocket[user1.socketID] = [];
        }
        matchedSocket[user1.socketID].push(user2.socketID);

        if (!matchedSocket[user2.socketID]) {
          matchedSocket[user2.socketID] = [];
        }
        matchedSocket[user2.socketID].push(user1.socketID);

        // Set timeout to remove the socket IDs after 3 minutes
        removeSocketIDAfterDelay(user1.socketID, user2.socketID, 30000);
        // Update the users' current rooms on the server-side by emitting messages to their sockets
        socket1.emit('updateCurrentRoom', room);
        socket2.emit('updateCurrentRoom', room);
        currentRoom = room;
        // Emit message to both users about matching with a random ghost
        socket1.emit('matchedInterests', ["No match found, you are matched with a random ghost"]);
        socket2.emit('matchedInterests', ["No match found, you are matched with a random ghost"]);
        // You might want to set some timeout or do some cleanup here as well
      }
    }
  }


  // Function to shuffle array elements (Fisher-Yates shuffle algorithm)
  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle
    while (currentIndex !== 0) {
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap it with the current element
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
  // Function to leave a room
  function leaveRoom(socketID, roomID, io) {
    if (roomID && activeRooms[roomID] && io) {
      const room = activeRooms[roomID];

      if (room.participants.hasOwnProperty(socketID)) {
        // Remove the user from the room
        delete room.participants[socketID];

        // Get the socket associated with the socketID
        const leaveSocket = io.sockets.sockets.get(socketID);

        if (leaveSocket) {
          // Remove the user from the room channel
          leaveSocket.leave(`room-${roomID}`);
          console.log(`User ${socketID} left room ${roomID} individually.`);

          // Optional: Notify other participants about the user leaving the room
          io.to(`room-${roomID}`).emit('participantLeft', { participantID: socketID });
        } else {
          console.log(`Socket ${socketID} not found.`);
        }
      }
    } else {
      console.log(`Invalid room or socket information.`);
    }
  }


  // Set interval to periodically check for matches
  setInterval(checkForMatches, 100); // Checks every 10 seconds (adjust as needed)

  // Function to remove socket ID from matchedSocket after a delay
  function removeSocketIDAfterDelay(socketID, matchedSocketID, delay) {
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

  socket.on('updateCurrentRoom', (roomID) => {
    const room = activeRooms[roomID];
    currentRoom = room;
    //console.log("work:",room);
  });
  socket.on('stop', (roomID) => {
    if (activeRooms[roomID]) {
      const room = activeRooms[roomID];
      const participantSocketIDs = Object.keys(room.participants);

      if (participantSocketIDs.length <= 2) {
        // Remove both users from active room
        participantSocketIDs.forEach((participantSocketID) => {
          // Remove user from waiting list if present
          const waitingUserIndex = waitingUser.findIndex(user => user.socketID === participantSocketID);
          if (waitingUserIndex !== -1) {
            waitingUser.splice(waitingUserIndex, 1);
            console.log(`User ${participantSocketID} removed from waiting list.`);
          }

          io.to(participantSocketID).emit('roomClosed');
          const leavingParticipant = room.participants[participantSocketID];
          console.log(`User ${leavingParticipant.nickname} (${participantSocketID}) left room ${roomID}.`);
          delete room.participants[participantSocketID];
          currentRoom = null;
        });

        delete activeRooms[roomID];
        console.log(`Room ${roomID} is now closed.`);
      } else {
        // Individual stop for a user when more than 2 participants are present
        io.to(socket.id).emit('ghostLost');
        socket.leave(`room-${roomID}`);
        const leavingParticipant = room.participants[socket.id];
        delete room.participants[socket.id];
        console.log(`User ${leavingParticipant.nickname} (${socket.id}) left room ${roomID} individually.`);
        io.to(`room-${roomID}`).emit('participantLeft', { participantID: socket.id, name: leavingParticipant.nickname });
        currentRoom = null;
      }

      console.log(`Active room ${roomID} participants:`, room.participants);
    }
    console.log("Waiting List:", waitingUser);
  });


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
    console.log("Chat message received:", data);

    if (currentRoom) {
      const { sender, message, timestamp } = data;
      roomID = currentRoom.roomID;

      if (sender === '' || sender === null) {
        sender = currentRoom.participants[socket.id].nickname;
      }
      // Send the message to the receiver
      io.to(`room-${roomID}`).emit("chat message", {
        sender: sender,
        message,
        timestamp
      });
      console.log(`Message sent in room ${roomID} by ${sender}: ${message}`);
    } else {
      console.log("No active room found for message:", data);
    }
  });


  socket.on('typing', (data) => {
    const { roomID } = data;
    socket.to(`room-${roomID}`).emit('typing', data);
    //console.log('Typing event emitted for room:', roomID);
  });
  socket.on('keepActive', () => {
    console.log("Server is activated");
  });


  socket.on('disconnect', () => {
    if (currentRoom) {
      const roomID = currentRoom.roomID;
      console.log(`Disconnecting socket: ${socket.id} from room: ${roomID}`);
      let name = 'undefined';
      if (currentRoom.participants[socket.id] && currentRoom.participants[socket.id].nickname) {
        name = currentRoom.participants[socket.id].nickname;
      }
      delete currentRoom.participants[socket.id];
      socket.leave(`room-${roomID}`);
      // Notify other participants about the disconnection
      console.log(`Emitting participantLeft event for: ${name}`);
      if (name !== 'undefined') {
        io.to(`room-${roomID}`).emit('participantLeft', { participantID: socket.id, name });
      }
      // Update participant list
      io.to(`room-${roomID}`).emit(
        'participantList',
        Object.values(currentRoom.participants)
      );
      // Remove the socket from matchedSocket
      console.log(`Deleting socket: ${socket.id} from matchedSocket`);
      delete matchedSocket[socket.id];
      const participantCount = Object.keys(currentRoom.participants).length;
      if (participantCount === 1) {
        // If only one participant left in the room
        const remainingParticipantID = Object.keys(currentRoom.participants)[0];
        // Notify the remaining participant about the disconnection
        console.log(`Emitting ghostLost event for the last participant: ${remainingParticipantID}`);
        io.to(remainingParticipantID).emit('roomClosed');
        const remainingSocket = io.sockets.sockets[remainingParticipantID];
        if (remainingSocket) {
          remainingSocket.leave(`room-${roomID}`);
        }
        // Delete the room
        console.log(`Deleting room: ${roomID}`);
        delete activeRooms[roomID];
      } else if (participantCount === 0) {
        // If no participants left in the room, delete the room
        console.log(`No participants left in room: ${roomID}. Deleting the room.`);
        delete activeRooms[roomID];
      }
      // Remove user from waiting list if present
      const waitingUserIndex = waitingUser.findIndex(user => user.socketID === socket.id);
      if (waitingUserIndex !== -1) {
        waitingUser.splice(waitingUserIndex, 1);
        console.log(`User ${socket.id} removed from waiting list.`);
      }
      console.log("Waiting List:", waitingUser);
      currentRoom = null;
    }
    currentRoom = null;
  });
  // Within the socket event handling logic
  // Helper function to join a room
  function joinRoom(socket, roomID) {
    currentRoom = null;
    const room = activeRooms[roomID];
    if (room) {
      const nickname = generateNickname(room);
      if (nickname) {
        room.participants[socket.id] = { nickname };
        currentRoom = room;
        console.log(`room-${roomID}`);
        socket.join(`room-${roomID}`);
        socket.emit("roomJoined", { roomID, nickname });

        // Notify other participants about the new participant
        socket.to(`room-${roomID}`).emit("participantJoined", { nickname });
        console.log("room join: " + roomID + " nickname: " + nickname);
        // Check if there are other participants in the room
        const numParticipants = Object.keys(room.participants).length;
        if (numParticipants > 1) {
          // Emit an event to enable keyboard functionality
          socket.emit("enableKeyboard");
          console.log("Keyboard enabled for room: " + roomID);
        }
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