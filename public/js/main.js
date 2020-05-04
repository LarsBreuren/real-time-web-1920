var socket = io();
roomName = document.getElementsByClassName("catogory")[0].id;
socket.emit('create', roomName);

// submit text message without reload/refresh the page
document.getElementById("chatForm").onsubmit = function (event) {
    event.preventDefault();
    socket.emit('chat_message', document.getElementById("txt").value);
    document.getElementById("txt").value = '';
    return false;
}

document.getElementById("answerForm").onsubmit = function (event) {
    var ele = document.getElementsByName('answer');

    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            answer = ele[i].value
    }
    event.preventDefault();
    socket.emit('answer_message', answer);
    document.getElementById("txt").value = '';
    return false;

}

socket.on('chat_message', function (msg) {
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

socket.on('is_online', function (username) {
    let newLI = document.createElement("LI");
    newLI.innerHTML = username;

    document.getElementById("messages").appendChild(newLI);
});


function scrollToBottom() {
    const messages = document.getElementById('messages');
    messages.scrollTop = messages.scrollHeight;
}