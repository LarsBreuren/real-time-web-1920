# Real time web
## Concept
A movie quiz, choose what genre you want the quiz to be about and start the game. You can chat, use commands and pick answers from a multiple choice section. The one with the most points wins the game!

![Screenshot_5](https://user-images.githubusercontent.com/43336468/80961185-afe41900-8e0a-11ea-982e-c97727ecc967.png)

## Tech stuff
- Node.js
- Express
- Socket.io
- Nodemon
- Gulp

## installation
  1. Clone the repository
  2. Open the terminal on the docs folder
  3 Install dependencies with `npm install`
  3. Give the command `npm run dev`
  4. navigate to localhost:3000

## API
The Movie Database.
A popular database for movies & TV shows.
Free of charge unless the project is commercial.
You get an API key when you register on their website.
You can get all kinds of data, for example details of a certain movie/serie or all a list of genres.


## Wishlist 
- [x] Connection with moviedb API 
- [x] Generate random movies
- [x] Score system
- [x] Diffrent options with answers
- [x] Diffrent catogories for the quiz
- [x] Add a delay to the randomMovie function 
- [x] Rooms for catogories
- [x] Add a round counter
- [x] Fix bug that 2 answers can be the same
- [ ] Fix that the same movie isnt asked again. (array with asked movies).
- [ ] Database with highscores
- [ ] Diffrent question other then the movie titles, quotes, release date, actors etc.


## DLC Diagram
![Data diagram](https://user-images.githubusercontent.com/43336468/80961347-0fdabf80-8e0b-11ea-93b7-fb6bfef64f9d.jpg)


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
  
 On a user message, also checks for commands
 
 ```js
 socket.on('chat_message', function(message) {
        if (message == '/start') {
            randomMovie();
        }
        if (message == '/skip') {
            randomMovie();
        }
        if( message == '/help'){
            io.to(catogory).emit('chat_message', '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message);
            io.to(catogory).emit('chat_message', ('server', '<img src="' + url +     io.sockets.adapter.rooms[catogory].movieHint + '">'));
        }
        else{
            io.to(catogory).emit('chat_message', '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message);
         }
    });
 ```
       
   When a user uses the multiple choice option the socket will listen to answer_message like this
```js
         socket.on('answer_message', function(message) {
        console.log('correct answer = ' + io.sockets.adapter.rooms[catogory].correctAnswer);
        console.log('answer = ' + message)
        if (message == io.sockets.adapter.rooms[catogory].correctAnswer) {
            socket.score++
            io.to(catogory).emit('chat_message',  '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' +                        message ); 
            io.to(catogory).emit('chat_message', ('Server', '<div class="server">' +  message + ' is goed! ' + socket.username + ' +1 </div>'));
            setTimeout( randomMovie, 1500);
        } else{
            io.to(catogory).emit('chat_message',  '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message + ' is fout!'); 
        }
    });
```

## Conclusion
Real time web was completely new for me, i struggled alot at the start.
The more i worked with sockets the more i felt confidend to try new stuff.
I chose movieDB because i like the content and i saw potential to make a good quiz with it.
I'm happy with what i have learned and reached with sockets. I still have some ideas of how to improve the quiz, maybe i'll add them later on.

