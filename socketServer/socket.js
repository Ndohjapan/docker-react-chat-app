const express = require('express')
const app = express()
const cors = require('cors');

const http = require('http').Server(app)

app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

socketIO.on('connection', (socket) => {
  console.log(
    `⚡: ${socket.id} user just connected!`
  );

  socket.on('createRoom', (data) => {
    socket.join(data.uid);
  });

  socket.on('message', (data) => {
    socketIO.to(data.uid).emit('newMessage', data.message);
  });

  socket.on('disconnect', () => {
    console.log(`🔥: ${socket.id} user disconnected`);
  });
});

http.listen(5001, () => {
  console.log('Socket is available on Port 5001');
});
