
var socket = io()

document.addEventListener('DOMContentLoaded', () => {
    localStorage.clear()
    socket.emit('setUserId');
});

socket.on('IdUser', (userId) => {
    console.log('ID do usuário atribuído:', userId);
    localStorage.setItem('IDUser', userId)
});

const changeHref = (href)=>{

        window.location.href = href;

}


