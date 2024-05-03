import express from "express"
import http from 'http'
import { Server, Socket } from "socket.io"

const server = express()

const httpServer = http.createServer(server)

const io = new Server(httpServer)

// rotas

server.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})
/*
io.on('connection', (socket)=>{
    console.log('user connected =>', socket.id)

    socket.on('message', (msg)=>{
        console.log('FILE APP - SOCKET - MSG', msg)
        io.emit('message', msg)
    })
})
*/
// parte da ideia do chhatGPT

const socketIdToUser = {}

const roomParticipants = {}

io.on('connection', (socket)=>{
    socket.on('setUserId', ()=>{
        socketIdToUser[socket.id] = socket.id
        socket.emit("IdUser", socket.id)
        console.log("ID do user", socket.id)
    })

    socket.on('createRoom', ()=>{
        if (socketIdToUser[socket.id]) {
            const roomId = Math.random().toString(36).substring(2,9)
        
            socket.join(roomId)
    
            roomParticipants[roomId] = [socketIdToUser[socket.id]]
            socket.emit('roomCreated', roomId);
            console.log('room creates', roomParticipants)
        }else{

        }

    })

    socket.on('joinRoom', (roomId)=>{

        if (roomParticipants[roomId]) {
            socket.join(roomId)
            socket.emit('joinRoom', (roomId))
        }else{
            socket.emit('joinRoom', false)
        }
    })

    socket.on('message', (msg, roomId)=>{
        console.log(msg, roomId)
        io.to(roomId).emit('messageReceived', {userId: socketIdToUser[socket.id], msg})
    })
})

//

//iniciar server
httpServer.listen(3000, ()=> console.log('server is running'))
