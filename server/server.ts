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

server.get('/joinroom', (req, res)=>{
    res.sendFile(__dirname + '/../client/joinRoom/index.html')
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

                const roomId = Math.random().toString(36).substring(2,9)

                socketIdToUser[ID][1] = roomId

                socket.join(roomId)
        
                roomParticipants[roomId] = [socketIdToUser[ID][0]]
                socket.emit('roomCreated', roomId);
                console.log('room creates', roomParticipants)
            }else if (socketIdToUser[ID][1]) {
                socket.emit('roomCreated', socketIdToUser[ID][1])
            }else{
                socket.emit('roomCreated', false);
            }   
        

    })

    socket.on('joinRoom', (roomId, ID)=>{

        if (roomParticipants[roomId] && socketIdToUser[ID]) {
            console.log(roomParticipants[roomId])

            for (let i = 0; i < roomParticipants[roomId].length; i++) {

                if (roomParticipants[roomId][i] === ID) {
                    return socket.emit('joinRoom', (roomId))
                }
                
            }

            roomParticipants[roomId].push(socketIdToUser[ID][0])
            socketIdToUser[ID][1] = true
            console.log('teste')
            socket.join(roomId)
            socket.emit('joinRoom', (roomId))
        }else{
            socket.emit('joinRoom', false)
        }
    })

    socket.on('message', (msg, roomId, ID)=>{
  
        if (socketIdToUser[ID] && roomParticipants[roomId]) {
            console.log(msg, roomId)
            console.log('rodando')
            console.log(socketIdToUser[ID], msg)
            io.to(roomId).emit('messageReceived', {userId: socketIdToUser[ID], msg})   
        }
    })
})

//

//iniciar server
httpServer.listen(3000, ()=> console.log('server is running'))
