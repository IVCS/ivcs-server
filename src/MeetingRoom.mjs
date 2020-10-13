export default class MeetingRoom {
  constructor(roomId) {
    this.roomId = roomId;
    this.userList = [];
  }

  addUser = (userId, username) => {
    if (!this.userList.includes(userId)) {
      this.userList.push({
        'userId': userId,
        'username': username,
      });
    }
  }

  getUserList = () => {
    return this.userList;
  }
}
