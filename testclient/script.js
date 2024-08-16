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

// room creation
function createRoom(username) {
  socket.emit('requestCreateRoom', username);
  waitingForRoom = true;
}

function joinRoom(username, code) {
  if (code == roomCode) {
    console.log("Already in room");
    return;
  }
  socket.emit('requestJoinRoom', username, code);
  waitingForRoom = true;
  // updateUI();
}

socket.on('joinRoom', (success, code) => {
  if (success) {
    console.log("Joined room", code);
    roomCode = code;
    waitingForRoom = false;
  } else {
    console.log("Could not find room. Check the code or create a room");
  }

  // updateUI()
});

socket.on('opponentJoinedRoom', (opponentName) => {
  console.log(opponentName, "joined to room!");
})

function leaveRoom() {
  socket.emit('leaveRoom');
}

const createRoomButton = document.getElementById("createRoomButton");
const roomCodeInput = document.getElementById("roomCodeInput");
const joinRoomButton = document.getElementById("joinRoomButton");
createRoomButton.onclick = () => createRoom(username);
joinRoomButton.onclick = () => {
  joinRoom(username, roomCodeInput.value);
}