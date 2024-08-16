const io = require('socket.io')(3000, {
  cors: {
    origin: ['http://localhost:8080']
  }
});

const rooms = {};
// # = {
//   player1Name, 
//   player1Id, 
//   player2Name, 
//   player2Id, 
// }
var problems;

function generateRoomCode(length) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += alphabet.charAt(Math.floor(Math.random() * 26));
  }
  return code;
}

// define interactions in here
io.on('connect', socket => {
  // confirmation log
  console.log("New client:", socket.id);

  // user clicks Create Room
  socket.on('requestCreateRoom', (username) => {
    let roomIndex = rooms.length;
    let roomCode = generateRoomCode(4);
    rooms[roomCode] = {
      player1Name: username, 
      player1Id: socket.id, 
    };
    console.log("Created room with code", roomCode);
    console.log("Player", rooms[roomCode].player1Name, "joined", roomCode);
    socket.emit('joinRoom', true, roomCode);
  });

  // user clicks Join Room
  socket.on('requestJoinRoom', (username, roomCode) => {
    roomCode = roomCode.toUpperCase();
    console.log("player requested to join room", roomCode);
    if (rooms.hasOwnProperty(roomCode)) {
      let room = rooms[roomCode];
      room.player2Name = username;
      room.player2Id = socket.id;
      socket.emit('joinRoom', true, roomCode); // true for success
      socket.to(room.player1Id).emit('opponentJoinedRoom', room.player2Name);
    } else {
      socket.emit('joinRoom', false, roomCode); // false for no room
    }
    
    
  });


  socket.on('leaveRoom', () => {

  })
});