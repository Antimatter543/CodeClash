const { spawnSync } = require('child_process');
const { readFile } = require('fs/promises');
const { appendFile } = require('fs/promises');
const { join } = require('path');

const express = require('express');
const app = express();
const server = require('http').Server(app);

const port = process.env.PORT || 3000;
const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174']
  }
});

var problems;

app.get('/', async (req, res, next) => {
  res.sendFile('index.html');
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const rooms = {};

async function importProblems() {
  const requestURL = 'https://raw.githubusercontent.com/Antimatter543/CodeClash/UI-rooms/questions/questions.json';
  const request = new Request(requestURL);

  const response = await fetch(request);
  problems = await response.json();

  console.log("problems[0]:", problems[0]);
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
    // console.log(room)
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
    //console.log("Created room with code", roomCode);
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
    //console.log(`User ${username} is attempting to join room ${roomCode}`);
  
    if (rooms.hasOwnProperty(roomCode)) {
        let room = rooms[roomCode];
        //console.log(`Room ${roomCode} found. Current state:`, room);
  
        if (!room.player1.connected) { // join as player 1
            rooms[roomCode].player1.connected = true; 
            rooms[roomCode].player1.id = socket.id;
            rooms[roomCode].player1.name = username;
            //console.log(`${username} joined room ${roomCode} as player 1. Player 1 ID: ${socket.id}`);
        } else if (!room.player2.connected) { // join as player 2
            rooms[roomCode].player2.connected = true; 
            rooms[roomCode].player2.id = socket.id;
            rooms[roomCode].player2.name = username;
            //console.log(`${username} joined room ${roomCode} as player 2. Player 2 ID: ${socket.id}`);
        } else {
            //console.log(`Room ${roomCode} is full. User ${username} cannot join.`);
            socket.emit('joinRoom', false, roomCode); // room is full
            return;
        }
      
        socket.join(roomCode);
        socket.emit('confirmJoin', true, roomCode, username); // Emit success message
        //console.log(`User ${username} successfully joined room ${roomCode}.`);
        //console.log(room);
  
        if (room.player1.connected && room.player2.connected) {
            io.to(room.player1.id).emit('playersJoinedRoom', true, room.player2.name);
            io.to(room.player2.id).emit('playersJoinedRoom', true, room.player1.name);
            console.log(`Both players have joined room ${roomCode}.`);
            console.log(room);
        }
    } else {
        //console.log(`Room ${roomCode} does not exist. User ${username} cannot join.`);
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
    opponentSocket(roomCode, username).emit("receiveOpponentCodeEdit", editType, index, length, text);
    console.log(`Room ${roomCode}: ${username} edited own code`);
  });

  // player submits code
  // problem number is which question the user is up to, not leetcode id
  socket.on('submitCode', (roomCode, username, problemNumber, code, language) => {
    const room = rooms[roomCode];
    
    submitCode(roomCode, username, problemNumber - 1, code, language);
  });

  function sendResults(roomCode, username, result) {
    const room = rooms[roomCode];
    const target = room.player1.name == username ? room.player1.id : room.player2.id;
    io.to(target).emit('receiveTestResults', result);
  }

  // sends request to python server
  async function submitCode(roomCode, username, problemNumber, code, language) {
    const requestURL = pythonAPIURL;
    const request = new Request(requestURL);

    const response = await fetch(request);
    const result = await response.json();

    sendResults(roomCode, username, result);
  }

  socket.on('requestProblem', (currentProblemNumber, roomCode) => { // send 0 as current problem number to start 
    const problem = problems[currentProblemNumber];
    const room = rooms[roomCode]
    console.log(room)
    if (currentProblemNumber === 0) {
      io.to(room.player1.id).emit('startGame', problem)
      io.to(room.player2.id).emit('startGame', problem)
    } else {
      socket.emit('nextProblem', problem); // problem object formatted
    }
  });

  // 
  /* SABOTAGE HANDLING */
  // 
  function message(roomCode, username, message) {
    opponentSocket(roomCode, username).emit('receiveMessage', message);
  }
  socket.on('sendMessage', (roomCode, username, message) => {
    message(roomCode[0], username[0], message);
  })

  // activate code swap for opponent
  socket.on('sendCodeSwap', (roomCode, username) => {
    opponentSocket(roomCode[0], username[0]).emit('triggerCodeSwap', username[0]);
    console.log(`Room ${roomCode}: ${username} edited opponent's code`);
  });
  
  // player edits opponents code
  socket.on('sendOpponentEdit', (roomCode, username, editType, index, length, text) => {
    opponentSocket(roomCode, username).emit("receiveOwnCodeEdit", editType, index, length, text);
    console.log(`Room ${roomCode}: ${username} edited opponent's code`);
  });

  socket.on('sendDisableMouse', (roomCode, username) => {
    opponentSocket(roomCode[0], username[0]).emit('triggerDisableMouse', username[0]);
    console.log(`Room ${roomCode}: ${username} edited opponent's code`);
  });

  socket.on('sendReverseArrowKeys', (roomCode, username) => {
    opponentSocket(roomCode[0], username[0]).emit('triggerReverseArrowKeys', username[0]);
    console.log(`Room ${roomCode}: ${username} used disable arrow keys`);
  });

  socket.on('sendDisableShortcuts', (roomCode, username) => {
    opponentSocket(roomCode[0], username[0]).emit('triggerDisableShortcuts', username[0]);
    console.log(`Room ${roomCode}: ${username} used disable arrow keys`);
  });
});