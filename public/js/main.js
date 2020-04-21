var socket = io();


// submit text message without reload/refresh the page
document.getElementById("chatForm").onsubmit = function(event){
    event.preventDefault();
    socket.emit('chat_message', document.getElementById("txt").value);
    document.getElementById("txt").value = '';
    return false;
}

socket.on('chat_message', function(msg){
    let newLI = document.createElement("LI");
    newLI.innerHTML = msg;
    newLI.setAttribute("id", "message");
    newLI.setAttribute("class", "message");

    document.getElementById("messages").appendChild(newLI);
    
    
    scrollToBottom();

});

var username = prompt('Please tell me your name');
var score = 0;
socket.emit('username', username, score);

socket.on('is_online', function(username) {
    let newLI = document.createElement("LI");
    newLI.innerHTML = username;

    document.getElementById("messages").appendChild(newLI);

    // let newUser = document.createElement("LI");
    // newUser.innerHTML = username;
    // document.getElementById("users").appendChild(newUser);


});


function scrollToBottom() {
    const messages = document.getElementById('messages');
messages.scrollTop = messages.scrollHeight;
}
