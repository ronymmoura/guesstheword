import { Server } from "socket.io";

const rooms = [];

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    res.socket.server.io.on("connection", (socket) => {
      console.log("connected");
      socket.on("create-room", () => createRoom(socket));
      socket.on("create-user", ({ roomId, userNick }) => createUser(socket, roomId, userNick));
      socket.on("join-room", ({ roomId, user }) => joinRoom(socket, roomId, user));
      socket.on("try", ({ roomId, user, word }) => tryWord(socket, roomId, user, word));
    });
  }

  res.end();
}

function createRoom(socket) {
  console.log("create-room");
  let roomId;

  while (!roomId) roomId = generateRoomId();

  rooms.push({
    roomId: Number(roomId),
    word: "TESTE",
    members: [],
  });

  socket.emit("room-created", roomId);
}

function createUser(socket, roomId, userNick) {
  console.log("create-user");
  const user = generateUser(userNick);

  const room = rooms.filter((x) => x.roomId === Number(roomId))[0];

  if (room.members.filter((x) => x.userNick === user.userNick).length === 0) {
    room.members.push(user);
  }

  socket.emit("update-room", room.members);
}

function joinRoom(socket, roomId, user) {
  console.log("join-room");
  const room = rooms.filter((x) => x.roomId === roomId)[0];

  if (room.members.filter((x) => x.id === user.id).length === 0) {
    room.members.push(user);
  }

  socket.emit("update-room", room.members);
}

function tryWord(socket, roomId, user, word) {
  const room = rooms.filter((x) => x.roomId === Number(roomId))[0];
  const targetUser = room.members.filter((x) => x.id === user.id)[0];

  targetUser.attempts.push(word);

  word.split("").forEach((char, index) => {
    if (room.word.includes(char) && !targetUser.foundChars.includes(char)) {
      targetUser.foundChars.push(char);
    }

    if (room.word[index] === char) {
      targetUser.rightPositionChars.push(char);
    }

    if (!room.word.includes(char)) {
      targetUser.wrongChars.push(char);
    }

    socket.emit("update-room", room.members);
  });
}

function generateUser(userNick) {
  const user = {
    id: getRandomInt(1, 999999),
    userNick,
    foundChars: [],
    rightPositionChars: [],
    wrongChars: [],
    attempts: [],
  };

  return user;
}

function generateRoomId() {
  var randomNumber = getRandomInt(1, 999999);

  if (rooms.filter((x) => x.roomId === randomNumber).length === 0) return randomNumber;

  return null;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
