# Real time web
## Concept
A movie quiz, choose what genre you want the quiz to be about and start the game. You can chat, use commands and pick answers from a multiple choice section. The one with the most points wins the game!

Moviedata coming from the moviedb API.

## Tech stuff
- Node.js
- Express
- Socket.io
- Nodemon
- Gulp

## Wishlist 
- [x] Connection with moviedb API 
- [x] Generate random movies in rooms
- [x] Score system
- [x] Diffrent options with answers
- [x] Diffrent catogories for the quiz
- [ ] Add a delay to the randomMovie function 
- [ ] Add a counter & show winner after x rounds
- [ ] Fix that the same movie isnt asked again. (array with asked movies).
- [ ] Database with highscores


## DLC Diagram
![Data diagram](https://user-images.githubusercontent.com/43336468/79773641-fda05200-8331-11ea-95c0-7bad6bd5bbb8.jpg)


## Real time events

A user connects to the quiz and/or leaves

```js
io.sockets.on('connection', function(socket) {
   
      io.emit('chat_message', ('server', '<div class="server">' + 'Welcome to real time chat!' + "<br>" + '<strong>' + 'Type /help to get a hint' + '<br>' +
      'Type /start to start' + '<br>' + 'or /skip to skip the current movie' + '</div>'));

    socket.on('username', function(username, score) {
        socket.username = username;
        socket.score = score;
        io.emit('is_online', '🔵 <i>' + socket.username + ' ' + '[' + socket.score + ']' + ' joined the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })  
```
  
 On a user message, also checks if it includes a valid answer or command
 
 ```js
    socket.on('chat_message', function(message, score) {
        if (message == '/start') {
            randomMovie();
        }
        if (message == '/skip') {
            randomMovie();
        }
        if (message == movieTitle) {
            socket.score++
            io.emit('chat_message', '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message);
            io.emit('chat_message', ('Server', 'Die is goed! ' + socket.username + ' +1'));
            randomMovie();
        }
        if( message == '/help'){
            io.emit('chat_message', '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message);
            io.emit('chat_message', ('server', '<img src="' + url + movieHint + '">'));
        }
        else{
            io.emit('chat_message', '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message);
         }
    }); 
 ```
       
   When a user uses the multiple choice option the socket will listen to answer_message like this
```js
     socket.on('answer_message', function(message) {
        console.log('correct answer = ' + correctAnswer);
        console.log('answer = ' + message)
        if (message == correctAnswer) {
            socket.score++
            io.emit('chat_message',  '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message + ' is goed!'); 
            io.emit('chat_message', ('Server', 'Die is goed! ' + socket.username + ' +1'));
            randomMovie();
        } else{
            io.emit('chat_message',  '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message + ' is fout!'); 
        }
    });
 });  
```

## Conclusion



