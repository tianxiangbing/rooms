/**
 * websocket
 */
const { User, Rooms } = require('./index')
const { MSG, actionType } = require('./message');
const server = require('http').createServer();
const io = require('socket.io')(server);
let rebots = {
}
let clients = {};//所有连接的客户端
//机器人类
class Rebot {
    constructor(type, x, direction) {
        this.id = Math.random().toString().split('.')[1];//主键
        this.type = type//类型
        this.x = x;//坐标
        this.direction = direction;//方向
    }
}
//大厅
io.on('connection', client => {
    let user = new User();
    clients[user.uid] = client;
    client.emit('user', user);
    client.on('join', roomId => {
        /* 加入某个房间 */
        Rooms.join(roomId, user, io, client);
        //判断房间内是否有机器人，没有则生成,
        if (!rebots[roomId] || rebots[roomId].length == 0) {
            //把第一个进
            rebots[roomId]=[];
            for (let i = 0; i < 10; i++) {
                let x = +(Math.random()*2000).toFixed(0);
                let direction = 0
                let rebot = new Rebot(roomId,x,direction);
                rebots[roomId].push(rebot);
            }
            let msg = new MSG(actionType.addRebots,{rebots:rebots[roomId]})
            Rooms.send(roomId,msg);
        }else if(Rooms[roomId].peoples.length){
            //如果房间里已经有其他人了，让他告诉我机器人的情况
            let uid = Rooms[roomId].peoples[0].uid ;
            let msg = new MSG(actionType.getRebots,{
                from:user.uid
            })
            clients[uid].emit('message',msg);
        }else{
            let msg = new MSG(actionType.addRebots,{rebots:rebots[roomId]})
            Rooms.send(roomId,msg);
        }
    });
    //同步机器人
    // client.on('rebots', msg => {
    //     // if (msg.type == actionType.addRebots) {
    //     //     let roomId = user.roomId;
    //     //     rebots[roomId] = msg.body;
    //     // }
    //     //获取当前房间的机器人信息
    //     if (msg.type == actionType.getRebots) {
    //         let roomId = user.roomId;
    //         let rs = rebots[roomId];
    //         let msg = new MSG(actionType.getRebots, {
    //             rebots: rs
    //         })
    //         Rooms.send(roomId, rs);
    //     }
    //     if (msg.type == actionType.updateRebots) {
    //         let roomId = user.roomId;
    //         rebots[roomId] = msg.body;
    //         let rs = rebots[roomId];
    //         let msg = new MSG(actionType.getRebots, {
    //             rebots: rs
    //         })
    //         Rooms.send(roomId, rs);
    //     }
    // });
    client.on('message', msg => {
        if (user.roomId) {
            // io.to(user.roomId).emit('message',msg)
            if (msg.type == actionType.updateRebots) {
                // let roomId = user.roomId;
                // rebots[roomId] = msg.body;
                let rs = msg.body.rebots;
                let msg = new MSG(actionType.addRebots,{
                    rebots: rs
                })
                // Rooms.send(roomId, rs);
                clients[msg.body.to].emit('message',msg);
            }else{
                if (msg.type == 'update') {
                    user.update(msg.body);
                }
                msg.user = user.uid;
                Rooms.send(user.roomId, msg);
            }
        } else {
            io.emit('message', msg)
        }
        console.log(msg)
    });
    client.on('disconnect', () => {
        /* … */
        console.log("连接断开")
        let uid = user.uid;
        delete clients[uid];
        Rooms.leave(user)
    });
});
server.listen(8099);
