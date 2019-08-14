/**
 * 房间
 */
const {MSG,actionType} = require('./message');

class Room {
    constructor(roomId, user, io) {
        this.peoples = [];
        this.io = io;
        this.roomId = roomId;
    }
    sendMsg(msg) {
        msg.roomId = this.roomId;
        this.io.to(this.roomId).emit('message',msg);
    }
    add(user,client) {
        let roomId = this.roomId;
        client.join(roomId, (a, b) => {
            let rooms = Object.keys(client.rooms);
            console.log(rooms);
            user.updateRoom(roomId,client)
            this.peoples.push(user);
            console.log(roomId + '新的用户加入', user)
            this.sendMsg(new MSG(actionType.join,{
                user:user.uid,
                peoples:this.mapPeoples()
            }));
        })
    }
    mapPeoples(){
        return this.peoples.map(user=>user.uid)
    }
    leave(user) {
        this.peoples.forEach((item, index) => {
            if (user.uid === item.uid) {
                this.peoples.splice(index, 1);
                user.client.leave(user.roomId,()=>{
                    this.sendMsg(new MSG(actionType.leave,{
                        user:user.uid,
                        peoples:this.mapPeoples()
                    }))
                })
            }
        })
    }
}
module.exports = Room;