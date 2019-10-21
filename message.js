const actionType = {
    join:'JOIN',//加入
    leave:'LEAVE',//离开
    talk:'TALK',//消息
    action:'ACTION',//用户操作
    push:'PUSH',//系统推送
    addRebots:'ADDREBOTS'//机器人
    updateRebots:'UPDATEREBOTS'//机器人
    getRebots:'GETREBOTS'//机器人
}
//消息体
class MSG {
    constructor(type,body){
        this.type = type;
        this.body= body;
    }
}
module.exports={
    MSG,
    actionType
}