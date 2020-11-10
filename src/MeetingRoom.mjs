import chalk from 'chalk';

export default class MeetingRoom {
  constructor(roomId) {
    this.roomId = roomId;
    this.userList = [];
  }

  getNumberOfUsers = () => {
    return this.userList.length;
  }

  removeUser = (userId) => {
    this.userList.forEach((user) => {
      if (user['userId'] === userId) {
        const index = this.userList.indexOf(user);
        this.userList.splice(index, 1);
        console.log(chalk.underline.red('[%s] %s has left the room.'),
            this.roomId, userId);
      }
    });
  }

  addUser = (userId, username) => {
    if (!this.userList.includes(userId)) {
      this.userList.push({
        'userId': userId,
        'username': username,
      });
      console.log(chalk.underline.green('[%s] %s has joined the room.'),
          this.roomId, userId);
    }
  }

  getUserList = () => {
    return this.userList;
  }
}
