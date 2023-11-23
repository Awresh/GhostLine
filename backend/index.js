// Import required modules
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const cors = require("cors")
const app = express();

const server = http.createServer(app);

app.use(cors())
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});
app.use(express.static('public'));


const users = {};
let room = 1
let full = 0
io.on('connection', (socket) => {
  socket.join("room-" + room);
  io.in("room-" + room).emit("connectedRoom", "room-" + room)

  full++;

  if (full >= 2) {
    full = 0;
    room++
  }

  socket.on('chat message', (data) => {
    const { sender, message, room, timestamp } = data;

    // Send the message to the receiver

    socket.to(room).emit('chat message', { sender, message, timestamp });



  });

  socket.on('typing', (data) => {
    const { room } = data
    socket.to(room).emit('typing', data);
  });


  socket.on('disconnect', () => {

    delete users[socket.id];
    io.emit('user list', Object.values(users));
    console.log('A user disconnected.');
  });

});
const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});