import express from "express"
import http from 'http'
import { Server } from "socket.io"

const server = express()

const httpServer = http.createServer(server)

const io = new Server(httpServer)

// rotas

server.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket)=>{
    console.log('user connected =>', socket.id)

    socket.on('message', (msg)=>{
        console.log('FILE APP - SOCKET - MSG', msg)
        io.emit('message', msg)
    })
})

//iniciar server
httpServer.listen(3000, ()=> console.log('server is running'))
