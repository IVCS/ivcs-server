import path from 'path';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import MeetingRoomList from './MeetingRoomList.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDirectoryPath = path.join(__dirname, '../../ivcs-web/public');
console.log(publicDirectoryPath);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3001;
app.use(express.static(publicDirectoryPath));

const meetingRoomList = new MeetingRoomList();

io.on('connection', (socket) => {
  socket.on('join room', (roomId, username) => {
    meetingRoomList.addRoom(roomId, username);
    console.log('roomId, username: ', roomId, username);
    console.log('class test: ', meetingRoomList.getUserList(roomId));
    socket.join(roomId, () => {
      socket.emit('user joined', username, meetingRoomList.getUserList(roomId));
      socket.to(roomId)
          .emit('user joined', username, meetingRoomList.getUserList(roomId));
    });
  });

  socket.on('signal from client', (data) => {
    const signal = JSON.parse(data);
    socket.to(signal.roomId).emit('signal from server', data);
    console.log('room name: ', signal.roomId);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
