/**
 * 房间
 */
const { MSG, actionType } = require('./message');

class Room {
    constructor(roomId, user, io) {
        this.peoples = [];
        this.io = io;
        this.roomId = roomId;
    }
    sendMsg(msg) {
        msg.roomId = this.roomId;
        console.log(`向${this.roomId}房间发送消息${msg}`)
        this.io.to(this.roomId).emit('message', msg);
    }
    add(user, client) {
        let roomId = this.roomId;
        client.join(roomId, (a, b) => {
            let rooms = Object.keys(client.rooms);
            console.log(rooms);
            user.updateRoom(roomId, client)
            this.peoples.push(user);
            console.log(`新的用户${user.uid}加入房间${roomId}`)
                //发送固定的消息格式
            this.sendMsg(new MSG(actionType.join, {
                user: user.uid,
                peoples: this.mapPeoples()
            }));
        })
    }
    mapPeoples() {
        return this.peoples.map(user => user.info)
    }
    leave(user) {
        this.peoples.forEach((item, index) => {
            if (user.uid === item.uid) {
                this.peoples.splice(index, 1);
                user.client.leave(user.roomId, () => {
                    console.log(`${user.uid}离开了${user.roomId}号房间`)
                    this.sendMsg(new MSG(actionType.leave, {
                        user: user.uid,
                        peoples: this.mapPeoples()
                    }))
                })
            }
        })
    }
}
module.exports = Room;