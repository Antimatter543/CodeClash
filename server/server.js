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
    if (room.player1.name === username) {
      return io.to(room.player2.id);
    } else {
      return io.to(room.player1.id);
    }
  }

  socket.on('requestCreateRoom', (username) => {
    let roomCode = generateRoomCode(4);
    rooms[roomCode] = {
      player1: {
        connected: true,
        name: username, 
        id: socket.id,
      }, 
      player2: {
        connected: false,
        name: "", 
        id: "",
      }, 
    };
    console.log("Created room with code", roomCode);
    socket.emit("confirmCreateRoom", roomCode);
  });

  function listRoomMembers() {
    console.log("Listing all room members:");
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      console.log(`Room Code: ${roomCode}`);
      console.log(`  Player 1: ${room.player1.name}, Connected: ${room.player1.connected}`);
      console.log(`  Player 2: ${room.player2.name}, Connected: ${room.player2.connected}`);
    }
  }
  
  // Call this function to check room members
  listRoomMembers();

  socket.on('requestJoinRoom', (roomCode, username) => {
    roomCode = roomCode.toUpperCase();
    console.log(`User ${username} is attempting to join room ${roomCode}`);
  
    if (rooms.hasOwnProperty(roomCode)) {
        let room = rooms[roomCode];
        console.log(`Room ${roomCode} found. Current state:`, room);
  
        if (!room.player1.connected) { // join as player 1
            room.player1.connected = true; 
            room.player1.id = socket.id;
            room.player1.name = username;
            console.log(`${username} joined room ${roomCode} as player 1. Player 1 ID: ${socket.id}`);
        } else if (!room.player2.connected) { // join as player 2
            room.player2.connected = true; 
            room.player2.id = socket.id;
            room.player2.name = username;
            console.log(`${username} joined room ${roomCode} as player 2. Player 2 ID: ${socket.id}`);
        } else {
            console.log(`Room ${roomCode} is full. User ${username} cannot join.`);
            socket.emit('joinRoom', false, roomCode); // room is full
            return;
        }
      
        socket.join(roomCode);
        socket.emit('confirmJoin', true); // Emit success message
        console.log(`User ${username} successfully joined room ${roomCode}.`);
  
        if (room.player1.connected && room.player2.connected) {
            io.to(roomCode).emit('playersJoinedRoom', roomCode);
            console.log(`Both players have joined room ${roomCode}.`);
        }
    } else {
        console.log(`Room ${roomCode} does not exist. User ${username} cannot join.`);
        socket.emit('joinRoom', false, roomCode); // no such room
    }
});

  // Handle disconnection
  socket.on('disconnect', () => {
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      if (room.player1.id === socket.id) {
        room.player1.connected = false;
        io.to(room.player2.id).emit('opponentDisconnected', room.player1.name);
        console.log(room.player1.name, "disconnected from room", roomCode);
      } else if (room.player2.id === socket.id) {
        room.player2.connected = false;
        io.to(room.player1.id).emit('opponentDisconnected', room.player2.name);
        console.log(room.player2.name, "disconnected from room", roomCode);
      }
    }
  });

  socket.on('leaveRoom', (roomCode) => {
    let room = rooms[roomCode];
    if (room) {
      if (room.player1.id === socket.id) {
        room.player1.connected = false;
        io.to(room.player2.id).emit('opponentDisconnected', room.player1.name);
      } else if (room.player2.id === socket.id) {
        room.player2.connected = false;
        io.to(room.player1.id).emit('opponentDisconnected', room.player2.name);
      }
    }
  });

  // player edits own code
  socket.on('sendOwnEdit', (roomCode, username, editType, index, length, text) => {
    opponentSocket(roomCode, username).emit("receiveOpponentCodeEdit", editType, index, length, text);
    console.log("playeredited")
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