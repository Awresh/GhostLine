import socketIOClient from 'socket.io-client';

const socket = socketIOClient('https://chat-et27.onrender.com/'); // Replace with your server URL
// socket.on("connectedRoom",(data)=>{
//     console.log(data)
// })
export default socket;
