const urlSite  = 'localhost/3000'

var socket = io()

document.addEventListener('DOMContentLoaded', () => {
    socket.emit('setUserId');
});

socket.on('IdUser', (userId) => {
    console.log('ID do usuário atribuído:', userId);
    localStorage.setItem('IDUser', userId)
});

const changeHref = (href)=>{

    if (href) {
        window.location.href = '/createroom';
    }else{

    }
}

const enter = ()=>{
    const roomID = document.getElementById('numberRoom').value
    socket.emit('joinRoom', roomID)
}



socket.on('joinRoom', (roomId)=>{
    console.log(roomId)
})

