var socket = io.connect('http://localhost:3000');

// submit text message without reload/refresh the page
$('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat_message', $('#txt').val());
    $('#txt').val('');
    return false;
});

// append the chat text message
socket.on('chat_message', function(msg){
    $('#messages').append($('<li>').html(msg));
});

// ask username
var username = prompt('Please tell me your name');
var score = 0;
socket.emit('username', username, score);

// append text if someone is online
socket.on('is_online', function(username) {
    $('#messages').append($('<li>').html(username));
});
