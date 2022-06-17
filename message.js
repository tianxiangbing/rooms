const actionType = {
        join: 'JOIN/加入房间', //加入
        leave: 'LEAVE/离开房间', //离开
        talk: 'TALK/消息发送', //消息
        action: 'ACTION/用户操作', //用户操作
        push: 'PUSH/系统推送' //系统推送
    }
    //消息体
class MSG {
    constructor(type, body) {
        this.type = type;
        this.body = body;
    }
}
module.exports = {
    MSG,
    actionType
}