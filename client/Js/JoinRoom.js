
var socket = io()

document.addEventListener('DOMContentLoaded', () => {

    const HTMLUSer = document.getElementById('idUser')

    const ID = localStorage.getItem('IDUser')
    
    HTMLUSer.innerHTML = 'Nome do usuário: ' + ID
            
});

const Join = ()=>{
    const roomID = document.getElementById('join').value
    const ID = localStorage.getItem('IDUser')
    console.log(ID)
    socket.emit('joinRoom', roomID, ID)

}

socket.on('messageReceived', (msg) => {
    const ul = document.getElementById('received');
    const title = document.getElementById('titlemist');
    title.innerHTML = msg['msg'];

    const li = document.createElement('li');
    li.classList.add('py-5', 'bg-slate-500');
    li.innerHTML = msg['msg'];

    // Insira o novo elemento <li> no início da lista
    if (ul.firstChild) {
        ul.insertBefore(li, ul.firstChild);
    } else {
        ul.appendChild(li); // Se a lista estiver vazia, apenas adicione o elemento
    }
});




socket.on('joinRoom', (roomId)=>{
    console.log(roomId)
    if (roomId) {
        localStorage.setItem('idRoom', roomId)
        document.getElementById('init').classList.add('hidden')
        document.getElementById('edit').classList.remove("hidden")
    }
})