const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socket(server)

server.listen(5000)
app.use(express.static(path.join(__dirname, 'public')))

let connected_users = []

io.on('connection', (socket)=>{
    console.log('conexão')
    socket.on('entry-request', (userName)=>{
        socket.userName = userName
        connected_users.push(userName)

        socket.emit('user-ok', connected_users)
        socket.broadcast.emit('list-update', {
            joined_user: userName,
            updated_list: connected_users
        })
    })
    
    socket.on('disconnect', ()=>{
        connected_users = connected_users.filter(u => u != socket.userName);
        if(socket.userName){
            socket.broadcast.emit('disconnection', {
                list: connected_users,
                disconnected: socket.userName
            })
        }

    })

    socket.on('send-msg', (msg)=>{
        let message = {
            name: socket.userName,
            msg: msg
        }
        socket.broadcast.emit('get-message', message)
        socket.emit('get-message-user', message)
    })
})