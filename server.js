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
    })
})