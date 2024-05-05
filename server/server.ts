import express from "express"
import http from 'http'
import { Server, Socket } from "socket.io"

const server = express()

const httpServer = http.createServer(server)

const io = new Server(httpServer)


// Define o diretório raiz para servir arquivos estáticos

server.use(express.static(__dirname + '/../client'));

// rotas

server.get('/', (req, res)=>{
    res.sendFile(__dirname + '/../client/index.html')
})

server.get('/createroom', (req, res)=>{
    res.sendFile(__dirname + '/../client/createroom/index.html')
})

const socketIdToUser = {}

const roomParticipants = {}

io.on('connection', (socket)=>{
    socket.on('setUserId', ()=>{
        socketIdToUser[socket.id] = [socket.id, false]
        socket.emit("IdUser", socket.id)
        console.log("ID do user", socket.id)
    })

    socket.on('createRoom', (ID)=>{
        if (!ID) {
           return socket.emit('roomCreated', false);
        }
        if (!socketIdToUser[ID]) {
            return socket.emit('roomCreated', false)
        }
            if (!socketIdToUser[ID][1]) {
                socketIdToUser[ID][1] = true
                const roomId = Math.random().toString(36).substring(2,9)
            
                socket.join(roomId)
        
                roomParticipants[roomId] = [socketIdToUser[ID]]
                socket.emit('roomCreated', roomId);
                console.log('room creates', roomParticipants)
            }else if (!socketIdToUser[ID][1]) {
                socket.emit('roomCreated', true)
            }else{
                socket.emit('roomCreated', false);
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
        if (socketIdToUser[socket.id] && roomParticipants[socket.id]) {
            console.log(msg, roomId)
            io.to(roomId).emit('messageReceived', {userId: socketIdToUser[socket.id], msg})   
        }
    })
})

//

//iniciar server
httpServer.listen(3000, ()=> console.log('server is running'))
