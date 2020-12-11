const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-message');
const roomName =document.getElementById('room-name');
const userList =document.getElementById('users');


//get url key value
const {username, room} =Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

console.log(username, room);

//join room
socket.emit('joinRoom', {username, room})


//GEt room and users
socket.on('userRoom', ({room , users}) =>{
    displayChatRoomName(room);
    displayUserList(users);
    console.log(" look her ${room}")

});

socket.on('message', message =>{
    console.log(message);

    //DOM manupilation
    outPutMessage(message);//message from server

    //scroll down
    // chatMessages.scrollTop= chatMessages.scrollHeight;
})

//event listener for the chat form
//message submit
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const msg = e.target.elements.msg.value; //receiving input message
    // console.log(msg)
    // emittingg message to server
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value="";
    e.target.elements.msg.focus();
});

//output message to DOM
function outPutMessage(message){
    const div= document.createElement('div');
    div.classList.add('message');
    div.innerHTML =`	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
   </p>`;
   document.querySelector('.chat-messages').appendChild(div);
}


function  displayChatRoomName(room){

    roomName.innerText = room;
    //DOM manipulation 
}

 function  displayUserList(users)
 {
     userList.innerHTML = `
     ${users.map(user => `<li>${user.username}</li>`).join()}
     `;
 }