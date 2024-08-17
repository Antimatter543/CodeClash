const io = require('socket.io')(3000, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174']
  }
});

const rooms = {};
// FOUR_CHAR_ROOM_CODE = {
//   player1.connected, 
//   player1.name, 
//   player1.id, 
//   player2.connected, 
//   player2.name, 
//   player2.id, 
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

  function opponentSocket(roomCode, username) {
    const room = rooms[roomCode];
    return socket.to(username == room.player1.id ? room.player2.id : room.player1.id);
  }

  // user clicks Create Room
  socket.on('requestCreateRoom', (username) => {
    let roomIndex = rooms.length;
    let roomCode = generateRoomCode(4);
    rooms[roomCode] = {
      player1: {
        connected: true, 
        id: socket.id, 
        name: username, 
      }, 
      player2: {
        connected: false,
      }, 
    };
    console.log("Created room with code", roomCode);
    console.log("Player", rooms[roomCode].player1.name, "joined", roomCode);
    socket.emit('joinRoom', true, roomCode);
  });

  // user clicks Join Room
  socket.on('requestJoinRoom', (username, roomCode) => {
    roomCode = roomCode.toUpperCase();
    if (rooms.hasOwnProperty(roomCode)) {
      let room = rooms[roomCode];
      if (room.player1.connected && room.player2.connected) {
        socket.emit('roomFull');
      }
      
      if (!room.player1.connected) { // join as player 1
        room.player1 = {
          connected: true, 
          id: socket.id, 
          name: username, 
        }
        if (room.player2.connected) {
          socket.to(room.player2.id).emit('opponentJoinedRoom', room.player2.name);
        }
        console.log(room.player1.name, "joined room", roomCode);
      } else { // join as player 2
        room.player2 = {
          connected: true, 
          id: socket.id, 
          name: username, 
        }
        if (room.player1.connected) {
          socket.to(room.player1.id).emit('opponentJoinedRoom', room.player2.name);
        }
        console.log(room.player2.name, "joined room", roomCode);
      }
      
      socket.emit('joinRoom', true, roomCode); // true for success
    } else {
      socket.emit('joinRoom', false, roomCode); // false for no room
    }
  });

  socket.on('leaveRoom', (roomCode) => {
    let room = rooms[roomCode];
    if (room.player1.id == socket.id) {
      if (room.player2.connected) {
        socket.to(room.player2.id).emit('opponentDisconnected', room.player2.name);
      }
      room.player1.connected = false;
    } else {
      if (room.player1.connected) {
        socket.to(room.player1.id).emit('opponentDisconnected', room.player2.name);
      }
      room.player2.connected = false;
    }
  });

  // player edits own code
  socket.on('sendOwnEdit', (roomCode, username, editType, index, length, text) => {
    opponentSocket(roomCode, username).emit("receiveOpponentCodeEdit", editType, index, length, text);
    console.log(playeredited)
  });

  // player edits opponents code
  socket.on('sendOpponentEdit', (roomCode, username, editType, index, length, text) => {
    opponentSocket(roomCode, username).emit("receiveOwnCodeEdit", editType, index, length, text);
    console.log("openenedited code")
  });

  // player submits code
  socket.on('submitCode', (roomCode, username, code, language) => {
    const room = rooms[roomCode];
    // code testing

    socket.emit('codeTestResults', consoleOutput, [test1Passed, test2Passed, test3Passed]);

    let points;
    let powerupPower;
    // update scoreboard
    if (passed) {
      socket.emit('receiveGamePoints', points, powerupPower);
      opponentSocket().emit('receiveScoreboard', room.scoreBoard);
    }
  });  

  // test sockets of each element
  socket.on('sendPing', (roomCode, username, componentName) => {
    console.log("ping received from", roomCode, username, componentName);
  });
});