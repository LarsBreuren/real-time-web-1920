const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message, room) {
  if(message.text == '/help'){
    commandResponse = "Need some help mate?"
    commands(commandResponse);
   } 
   else if(message.text == '/marco'){
    commandResponse = "Polo"
    commands(commandResponse);
   }  
   else if(message.text.includes("mobile") &&  roomName.innerText == "Games" ){
    // window.location.href = '/'; optional kick
    commandResponse = "Someone spoke of mobile games, this chat is now destroyed x.x";
    commands(commandResponse);
    socket.emit('forceDisconnect');
     
   }
   else if(message.text.includes("hamilton") &&  roomName.innerText == "Formula 1" ){
    // window.location.href = '/'; optional kick
    commandResponse = "No speaking of Hamilton!";
    commands(commandResponse);
   }
   else {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
   }
}

function commands(commandResponse){
const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${'Server'}</p>
  <p class="text">
    ${commandResponse}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}



// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
