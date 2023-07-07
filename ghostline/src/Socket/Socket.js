import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:3000'); // Replace with your server URL
// socket.on("connectedRoom",(data)=>{
//     console.log(data)
// })
export default socket;
