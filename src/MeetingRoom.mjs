export default class MeetingRoom {
  constructor(roomId) {
    this.roomId = roomId;
    this.userList = [];
  }

  addUser = (username) => {
    if (!this.userList.includes(username)) {
      this.userList.push(username);
    }
  }

  getUserList = () => {
    return this.userList;
  }
}
