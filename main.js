/**
 * websocket
 */
const { User, Rooms } = require('./index')
const { MSG, actionType } = require('./message');
const server = require('http').createServer();
const io = require('socket.io')(server);
let rebots = {
}
//大厅
io.on('connection', client => {
    let user = new User();
    client.emit('user', user);
    client.on('join', data => {
        /* 加入某个房间 */
        Rooms.join(data, user, io, client)
    });
    //同步机器人
    client.on('rebots', msg => {
        if (msg.type == actionType.addRebots) {
            let roomId = user.roomId;
            rebots[roomId] = msg.body;
        }
        //获取当前房间的机器人信息
        if (msg.type == actionType.getRebots) {
            let roomId = user.roomId;
            let rs = rebots[roomId];
            let msg = new MSG(actionType.getRebots, {
                rebots: rs
            })
            Rooms.send(roomId, rs);
        }
        if (msg.type == actionType.updateRebots) {
            let roomId = user.roomId;
            rebots[roomId] = msg.body;
            let rs = rebots[roomId];
            let msg = new MSG(actionType.getRebots, {
                rebots: rs
            })
            Rooms.send(roomId, rs);
        }
    });
    client.on('message', msg => {
        if (user.roomId) {
            // io.to(user.roomId).emit('message',msg)
            if (msg.type == 'update') {
                user.update(msg.body);
            }
            msg.user = user.uid;
            Rooms.send(user.roomId, msg)
        } else {
            io.emit('message', msg)
        }
        console.log(msg)
    });
    client.on('disconnect', () => {
        /* … */
        console.log("连接断开")
        Rooms.leave(user)
    });
});
server.listen(8099);
