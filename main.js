/**
 * websocket
 */
const {User,Rooms}  = require('./index')
const server = require('http').createServer();
const io = require('socket.io')(server);

//大厅
io.on('connection', client => {
    let user = new User();
    client.emit('user',user);
    client.on('join', data => {
        /* 加入某个房间 */
        Rooms.join(data,user,io,client)
    });
    client.on('message',msg=>{
        if(user.roomId){
            // io.to(user.roomId).emit('message',msg)
            if(msg.type == 'update'){
                user.update(msg.body);
            }
            msg.user = user.uid;
            Rooms.send(user.roomId,msg)
        }else{
            io.emit('message',msg)
        }
        console.log(msg)
    })
    client.on('disconnect', () => {
        /* … */
        console.log("连接断开")
        Rooms.leave(user)
    });
});
server.listen(8099);
