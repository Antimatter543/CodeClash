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

async function importProblems() {
  const requestURL = 'https://raw.githubusercontent.com/Antimatter543/CodeClash/main/questions/questions.json';
  const request = new Request(requestURL);

  const response = await fetch(request);
  problems = await response.json();

  console.log("Problems:", problems);
}

importProblems();

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
    console.log("opponentSocket()", roomCode, username);
    const room = rooms[roomCode];
    console.log(room)
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
    listRoomMembers()
    socket.emit("confirmCreateRoom", true, roomCode, username);
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
            rooms[roomCode].player1.connected = true; 
            rooms[roomCode].player1.id = socket.id;
            rooms[roomCode].player1.name = username;
            console.log(`${username} joined room ${roomCode} as player 1. Player 1 ID: ${socket.id}`);
        } else if (!room.player2.connected) { // join as player 2
            rooms[roomCode].player2.connected = true; 
            rooms[roomCode].player2.id = socket.id;
            rooms[roomCode].player2.name = username;
            console.log(`${username} joined room ${roomCode} as player 2. Player 2 ID: ${socket.id}`);
        } else {
            console.log(`Room ${roomCode} is full. User ${username} cannot join.`);
            socket.emit('joinRoom', false, roomCode); // room is full
            return;
        }
      
        socket.join(roomCode);
        socket.emit('confirmJoin', true, roomCode, username); // Emit success message
        console.log(`User ${username} successfully joined room ${roomCode}.`);
        console.log(room);
  
        if (room.player1.connected && room.player2.connected) {
            socket.to(room.player1.id).emit('playersJoinedRoom', true);
            socket.to(room.player2.id).emit('playersJoinedRoom', true);
            console.log(`Both players have joined room ${roomCode}.`);
            console.log(room);
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
        rooms[roomCode].player1.connected = false;
        io.to(room.player2.id).emit('opponentDisconnected', room.player1.name);
        console.log(room.player1.name, "disconnected from room", roomCode);
      } else if (room.player2.id === socket.id) {
        rooms[roomCode].player2.connected = false;
        io.to(room.player1.id).emit('opponentDisconnected', room.player2.name);
        console.log(room.player2.name, "disconnected from room", roomCode);
      }
    }
  });

  socket.on('leaveRoom', (roomCode) => {
    let room = rooms[roomCode];
    if (room) {
      if (room.player1.id === socket.id) {
        rooms[roomCode].player1.connected = false;
        io.to(room.player2.id).emit('opponentDisconnected', room.player1.name);
      } else if (room.player2.id === socket.id) {
        rooms[roomCode].player2.connected = false;
        io.to(room.player1.id).emit('opponentDisconnected', room.player2.name);
      }
    }
  });

  // player edits own code
  socket.on('sendOwnEdit', (roomCode, username, editType, index, length, text) => {
    opponentSocket(roomCode[0], username[0]).emit("receiveOpponentCodeEdit", editType, index, length, text);
    console.log("playeredited")
  });

  // player edits opponents code
  socket.on('sendOpponentEdit', (roomCode, username, editType, index, length, text) => {
    opponentSocket(roomCode[0], username[0]).emit("receiveOwnCodeEdit", editType, index, length, text);
    console.log("openenedited code")
  });

  // player submits code
  // problem number is 
  socket.on('submitCode', (roomCode, username, problemNumber, code, language) => {
    const room = rooms[roomCode];
    // code testing

    socket.emit('codeTestResults', consoleOutput, [test1Passed, test2Passed, test3Passed]);

    let points;
    // update scoreboard
    if (passed) {
      socket.emit('receiveGamePoints', points, powerupPower);
      opponentSocket().emit('receiveScoreboard', room.scoreBoard);
    }
  });  

  socket.on('requestProblem', (currentProblemNumber, roomCode) => { // send 0 as current problem number to start 
    const problem = problems[currentProblemNumber];
    const room = rooms[roomCode[0]]
    if (currentProblemNumber === 0) {
      socket.to(room.player1.id).emit('startGame', problem)
      socket.to(room.player2.id).emit('startGame', problem)
    }
    
    socket.('nextProblem', problem); // problem object formatted
  });



  // test sockets of each element
  

  // 
});