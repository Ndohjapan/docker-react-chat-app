const app = require('./src/app');
const database = require('./src/config/database');
const cors = require('cors');
const http = require('http').Server(app);

database();

app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

socketIO.on('connection', (socket) => {
  console.log(
    `⚡: ${socket.id} user just connected! \n`,
    socket.handshake.auth
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

http.listen(5000, () => {
  console.log('App has started on 5000');
});
