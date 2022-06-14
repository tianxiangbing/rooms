/**
 * rooms
 * @function join,send,leave
 */
const Room = require('./room');
let Rooms = {
    rooms: [],
    keys: {},
    join(roomId, user, io, client) {
        if (user.roomId) {
            //已在房间要先退出
            this.leave(user);
        }
        if (!Rooms.hasOwnProperty(roomId)) {
            //如果没有该房间则新建一个房间
            Rooms[roomId] = new Room(roomId, user, io);
        }
        //保存改用户的id到对应的房间
        Rooms[roomId].add(user, client);
    },
    send(roomId, msg) {
        Rooms[roomId].sendMsg(msg)
    },
    leave(user) {
        user.roomId && Rooms[user.roomId].leave(user);
    },
    getList() {
        for (let k in this.keys) {
            this.rooms.push(this.keys[k]);
        }
        return this.rooms;
    }
}
module.exports = Rooms;