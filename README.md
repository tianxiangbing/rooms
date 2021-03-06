# 多房间聊天室案例
本案例采用socket.io实现多房间多人聊天，主要实现了两个类，一个是用户`User`,一个是房间`Rooms`类
# 安装使用
```
npm install socket.io-rooms --save
```
# demo演示
把项目clone下来后，执行`npm start`,然后打开`example/index.html`即可品尝到演示效果
# 使用方式
## 服务端Server
```
const {User,Rooms}  = require('socket.io-rooms')
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
server.listen(80);
```
这里传输统一使用`JSON`格式，消息`title`也以`message`为主,这里端口写的80，你可以使用其他端口，如果你是Express，也可以共用80端口。
## 客户端调用Client
```
const socket = io('http://localhost');
log =(...args)=>{
    document.getElementById('log').innerHTML +='<br/>'+args.map(item=>JSON.stringify(item)).join(' ')+'=>'+(+new Date());
} 

log(socket.id)
let user ={},room,client;
socket.on('connect', (c) => {
    log('connect ...', socket.id);
    socket.on('user',u=>{
        user = u;
        log('用户ID',u.uid)
    });
});
socket.on('message',msg=>{
    log('message:',msg)
});
function joinroom(num){
    //加入房间号为1的房间
    socket.emit('join',num);
}
function send(){
    let msg = document.getElementById('msg').value;
    socket.emit('message',{type:'TALK',body:msg})
    // setInterval(function(){
    //     socket.emit('message',{type:'TALK',body:+new Date()})
    // },2000)
}
```