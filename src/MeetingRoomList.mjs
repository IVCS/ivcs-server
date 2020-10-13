import MeetingRoom from './MeetingRoom.mjs';

export default class MeetingRoomList {
  constructor() {
    this.roomList = {};
  }

  addRoom = (roomId, userId, username) => {
    if (roomId in this.roomList) {
      this.roomList[roomId].addUser(userId, username);
    } else {
      const room = new MeetingRoom(roomId);
      room.addUser(userId, username);
      this.roomList[roomId] = room;
    }
  }

  getUserList = (roomId) => {
    return this.roomList[roomId].getUserList();
  }

  printRoomList = () => {
    console.log(this.roomList);
  }
}
