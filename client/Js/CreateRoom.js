
var socket = io()

document.addEventListener('DOMContentLoaded', () => {

    const ID = localStorage.getItem('IDUser')
    console.log(ID)
    socket.emit('createRoom', ID);
            
});

const enviar = ()=>{
    const check = document.getElementById('check');

    document.getElementById('instruction').classList.add('hidden')

    const msg = document.getElementById('message');

    const roomId = localStorage.getItem('idRoom');

    const ID = localStorage.getItem('IDUser');

    if (!msg && roomId) {
        return
    }
 
    if (check.checked) {
        let number = localStorage.getItem('number');
        if (!number) {
            localStorage.setItem('number', 1);
            number = 1; // Inicializa com 1 se não estiver presente no armazenamento local
        }  
    
        // Emita a mensagem incluindo o número atual
        socket.emit('message', `${msg.value} ${number}`, roomId, ID);
    
        // Atualize o número incrementando-o e armazenando-o novamente
        localStorage.setItem('number', ++number);
    }
    else{

        console.log(msg.value)

        socket.emit('message', msg.value, roomId, ID)

        msg.innerHTML = ""
    }

}

socket.on('messageReceived', (msg)=>{
    console.log(msg)
    const ul = document.getElementById('received')
    const li = document.createElement('li')
    li.innerHTML = "menssagem recebida: " + msg['msg']
    console.log(li)
    ul.appendChild(li)
})


socket.on('roomCreated', (roomId) => {
    console.log(roomId)
    if (roomId) {
        localStorage.setItem('idRoom', roomId)

        const HTMLUSer = document.getElementById('idUser')

        const HTMLRoom = document.getElementById('idRoom')

        const ID = localStorage.getItem('IDUser')
        
        console.log(HTMLRoom, HTMLUSer)

        HTMLUSer.innerHTML = 'Nome do usuário: ' + ID
        HTMLRoom.innerHTML = "Código da sala: " + roomId
    }else{
        alert('o usuário não foi encontrado no sistema, deletando usuário e criando um novo automaticamente')
        window.location.href = '/';
    }

});