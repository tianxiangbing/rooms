/**
 * 用户
 */
class User {
    constructor(props){
        this.uid = +new Date();
        this.info = {};
        this.info.uid = this.uid;
    }
    updateRoom(roomId,client){
        this.roomId = roomId;
        this.client = client;
    }
    update(info){
        Object.assign(this.info,info);
    }
}
module.exports = User