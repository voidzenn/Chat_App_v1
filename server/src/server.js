const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const uuid = require('uuid').v1();

const PORT = 8082;

app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

const userId = uuid;

socketIO.on('connection', (socket) => {
  // Listen for new connected users
  socket.on('new-user-joined', () => {
    console.log('user joined: ', userId);
  });

  socket.on('send-message', (msg) => {
    console.log('broadcasing message:', msg);
    // Send to current user
    socket.emit('new-message', msg);
    // Send message to all users
    socket.broadcast.emit('new-message', msg);
  });

  //
  socket.on('disconnect', () => {
    console.log('user disconnected: ', userId);
  });
});

http.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
