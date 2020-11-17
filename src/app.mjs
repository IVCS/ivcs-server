import path from 'path';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import chalk from 'chalk';

import MeetingRoomManager from './MeetingRoomManager.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDirectoryPath = path.join(__dirname, '../../ivcs-web/public');
console.log(publicDirectoryPath);

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3001;
app.use(express.static(publicDirectoryPath));

const meetingRoomManager = new MeetingRoomManager();

io.on('connection', (socket) => {
  socket.on('join room', (roomId, userId, username) => {
    meetingRoomManager.addRoom(roomId, userId, username);
    socket.join(roomId, () => {
      socket.emit('user joined', userId, username,
          meetingRoomManager.getUserList(roomId));
      socket.to(roomId).emit('user joined', userId, username,
          meetingRoomManager.getUserList(roomId));
    });
  });

  socket.on('signal from client', (data) => {
    const signal = JSON.parse(data);
    socket.to(signal.destUserId).emit('signal from server', data);
  });

  socket.on('text message', (roomId, username, inputMessage) => {
    console.log(chalk.underline.blue('[%s] %s: %s.'),
        roomId, username, inputMessage);
    socket.to(roomId).emit('text message', username, inputMessage);
  });

  socket.on('disconnect', () => {
    const userId = socket.id;
    const roomId = meetingRoomManager.getRoomId(userId);
    socket.to(roomId).emit('user left', userId);
    // If the number of users in the room is 0, remove the room.
    meetingRoomManager.removeRoom(roomId, userId);
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
