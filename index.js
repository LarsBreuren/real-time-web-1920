require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const fetch = require('node-fetch')
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/chat', function(req, res) {
    res.render('chat.ejs');
});

app.get('/movies', (req, res) => {
    fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${process.env.MOVIEDB_TOKEN}`)
      .then(async response => {
        const movieData = await response.json()
        console.log(movieData);
        let randomItem = movieData.results[Math.random() * movieData.results.length | 0];
        res.render('movies', {
          title: 'Movies',
          randomMovie: randomItem,
          movieData,
        });
      })
  })

  let movieTitle = '';
  let movieHint = '';
  let url = 'https://image.tmdb.org/t/p/w500/';
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

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
});


function randomMovie(){

    fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${process.env.MOVIEDB_TOKEN}`)
    .then(async response => {
      const movieData = await response.json()
      let randomItem = movieData.results[Math.random() * movieData.results.length | 0];

      // Welcome current user
      io.emit('chat_message', ('server', '<div class="server">' + 'What movie is this?' + '</strong>' + "<br><br>" + randomItem.overview + '</div>'));
      let movieTitleLower = randomItem.original_title.toLowerCase();

      movieHint = randomItem.poster_path;

      movieTitle = movieTitleLower;
      console.log('Antwoord = ' + movieTitle);
    })

}

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));