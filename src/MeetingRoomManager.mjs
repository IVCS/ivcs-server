import MeetingRoom from './MeetingRoom.mjs';
import chalk from 'chalk';

export default class MeetingRoomManager {
  constructor() {
    this.roomList = {};
  }

  removeRoom = (roomId, userId) => {
    this.roomList[roomId].removeUser(userId);
    if (this.roomList[roomId].getNumberOfUsers() === 0) {
      delete this.roomList[roomId];
      console.log(chalk.bold.red('[%s] Room destroyed.'), roomId);
    }
  }

  addRoom = (roomId, userId, username) => {
    if (roomId in this.roomList) {
      this.roomList[roomId].addUser(userId, username);
    } else {
      const room = new MeetingRoom(roomId);
      console.log(chalk.bold.green('[%s] Room created.'), roomId);
      room.addUser(userId, username);
      this.roomList[roomId] = room;
    }
  }

  getUserList = (roomId) => {
    return this.roomList[roomId].getUserList();
  }

  getRoomId = (userId) => {
    let roomId = null;
    Object.values(this.roomList).forEach((value) => {
      value.userList.forEach((user) => {
        if (user.userId === userId) {
          roomId = value.roomId;
        }
      });
    });
    return roomId;
  }
}
