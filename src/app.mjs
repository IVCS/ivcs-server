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
  socket.on('join room', (roomId, userId, username) => {
    meetingRoomList.addRoom(roomId, userId, username);
    socket.join(roomId, () => {
      socket.emit('user joined', userId, username,
          meetingRoomList.getUserList(roomId));
      socket.to(roomId).emit('user joined', userId, username,
          meetingRoomList.getUserList(roomId));
    });
  });

  socket.on('signal from client', (data) => {
    const signal = JSON.parse(data);
    socket.to(signal.destUserId).emit('signal from server', data);
  });

  socket.on('disconnect', () => {
    const userId = socket.id;
    const roomId = meetingRoomList.getRoomId(userId);
    console.log('roomid, userid', roomId, userId);
    socket.to(roomId).emit('user left', userId);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
