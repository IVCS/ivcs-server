import path from 'path';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

import express from 'express';
import http from 'http';
import socketio from 'socket.io';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDirectoryPath = path.join(__dirname, '../../ivcs-web/public');
console.log(publicDirectoryPath);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3001;
app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  socket.on('join room', (roomName, username) => {
    socket.join(roomName, () => {
      io.to(roomName)
          .emit('user joined', `${username} has joined the ${roomName} room`);
    });
  });

  socket.on('signal from client', (data) => {
    const signal = JSON.parse(data);
    io.to(signal.roomName).emit('signal from server', data);
    console.log('room name: ', signal.roomName);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
