
var socket = io()

document.addEventListener('DOMContentLoaded', () => {

    const ID = localStorage.getItem('IDUser')
    console.log(ID)
    socket.emit('createRoom', ID);
            
});

const enviar = ()=>{
    const msg = document.getElementById('message')
    const roomId = document.getElementById('idRoom')
    socket.emit('message', msg, roomId)
}

socket.on('roomCreated', (roomId) => {
    console.log(roomId)
    if (roomId) {
        localStorage.setItem('idRoom', roomId)

        const HTMLUSer = document.getElementById('idUser')

        const HTMLRoom = document.getElementById('idRoom')

        const ID = localStorage.getItem('IDUser')
    
        HTMLUSer.innerHTML = 'Nome do usuário: ' + ID
        HTMLRoom.innerHTML = "Código da sala: " + roomId
    }else{
        alert('o usuário não foi encontrado no sistema, deletando usuário e criando um novo automaticamente')
        window.location.href = '/';
    }

});