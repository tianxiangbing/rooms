/**
 * 用户
 */
class User {
    constructor(props){
        this.uid = +new Date();
    }
    updateRoom(roomId,client){
        this.roomId = roomId;
        this.client = client;
    }
}
module.exports = User