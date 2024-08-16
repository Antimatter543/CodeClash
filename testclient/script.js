import { io } from 'socket.io-client';

// connect to server
const serverURL = 'http://localhost:3000';
const socket = io(serverURL);

socket.on('connect', () => {
  console.log("Connected to server. id:", socket.id);
});

let waitingForRoom = false;
let roomCode = "";
let username = "player" + Math.floor(Math.random() * 10000).toString();
document.getElementById('username').textContent = username;
console.log("Username", username);

const roomCodeText = document.getElementById("currentRoomCode");
function setRoomCode(code = false) {
  if (code) {
    roomCode = code;
    roomCodeText.textContent = code;
  } else {
    roomCode = "";
    roomCodeText.textContent = "Create or join a room!";
  }
}

// room creation
function createRoom(username) {
  if (roomCode) {
    leaveRoom();
  }
  socket.emit('requestCreateRoom', username);
  waitingForRoom = true;
}

function joinRoom(username, code) {
  if (code.length != 4) {
    console.log("Invalid room code");
    return;
  } else if (code == roomCode) {
    console.log("Already in room");
    return;
  }
  socket.emit('requestJoinRoom', username, code);
  waitingForRoom = true;
  // updateUI();
}

function leaveRoom() {
  // make sure user is in a room
  if (roomCode) {
    socket.emit('leaveRoom', roomCode);
    setRoomCode();
  } else {
    console.log("Not currently in a room.");
  }
}

socket.on('joinRoom', (success, code) => {
  if (success) {
    if (roomCode != code && roomCode) {
      leaveRoom();
    }
    console.log("Joined room", code);
    setRoomCode(code);
  } else {
    console.log("Could not find room. Check the code or create a room");
  }
  waitingForRoom = false;

  // updateUI()
});

socket.on('opponentJoinedRoom', (opponentName) => {
  console.log(opponentName, "joined the room!");
});

socket.on('opponentDisconnected', (username) => {
  console.log(username, "disconnected.");
});

const createRoomButton = document.getElementById("createRoomButton");
const roomCodeInput = document.getElementById("roomCodeInput");
const joinRoomButton = document.getElementById("joinRoomButton");
const leaveRoomButton = document.getElementById("leaveRoomButton");
createRoomButton.onclick = () => createRoom(username);
joinRoomButton.onclick = () => {
  joinRoom(username, roomCodeInput.value);
}
leaveRoomButton.onclick = leaveRoom;