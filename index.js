const io = require('socket.io-client');

// Replace 'https://test-k2nu.onrender.com' with your server's address
const socket = io('https://test-k2nu.onrender.com');

// Function to emit 'keepActive' event to the server
function sendKeepActiveEvent() {
console.log(socket);
  socket.emit('keepActive');
  console.log('Sent keepActive event to the server.');
}

// Emit 'keepActive' event every 5 minutes (adjust interval as needed)
setInterval(sendKeepActiveEvent,   1000); // 5 minutes in milliseconds
