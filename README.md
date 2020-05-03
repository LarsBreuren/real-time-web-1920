# Real time web
## Concept
Customized chat app with rooms, in each room the server/bot will ask questions about movies and the users have to ask what movie it is. The fastest correct answer wins. There is a highscore & fastest reaction scoreboard that is saved to a database.

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



