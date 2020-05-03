require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const fetch = require('node-fetch')
const socketio = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: true}));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', function(req, res) {
    res.render('index.ejs');
});





app.get('/category', function(req, res) {
    res.render('category.ejs')
});


app.get('/movies', (req, res) => {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIEDB_TOKEN}&with_genres=28`)
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

  app.post('/chat', function(req, res) {
    category = req.body.category;
    catogory = req.body.category;
    res.render('chat.ejs',{
        category: req.body.category
    })
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.sockets.on('connection', function(socket, catogory) {
    socket.on('create', function(catogory) {
        socket.join(catogory);

        let movieTitle = '';
        let movieHint = '';
        let correctAnswer = '';
        let counter = 0;
        let url = 'https://image.tmdb.org/t/p/w500/';
        let currentGenre = catogory;
   
    socket.join('some room');
      io.to(catogory).emit('chat_message', ('server', '<div class="server">' + 'Welcome to real time chat!' + "<br>" + '<strong>' + 'Type /help to get a hint' + '<br>' +
      'Type /start to start' + '<br>' + 'or /skip to skip the current movie' + '</div>'));

    socket.on('username', function(username, score) {
        socket.username = username;
        socket.score = score;
        io.to(catogory).emit('is_online', '🔵 <i>' + socket.username + ' ' + '[' + socket.score + ']' + ' joined the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.to(catogory).emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
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
            io.to(catogory).emit('chat_message', '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message);
            io.to(catogory).emit('chat_message', ('Server', 'Die is goed! ' + socket.username + ' +1'));
            randomMovie();
        }
        if( message == '/help'){
            io.to(catogory).emit('chat_message', '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message);
            io.to(catogory).emit('chat_message', ('server', '<img src="' + url + movieHint + '">'));
        }
        else{
            io.to(catogory).emit('chat_message', '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message);
         }
    });
  
    socket.on('answer_message', function(message) {
        console.log('correct answer = ' + correctAnswer);
        console.log('answer = ' + message)
        if (message == correctAnswer) {
            socket.score++
            io.to(catogory).emit('chat_message',  '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message + ' is goed!'); 
            io.to(catogory).emit('chat_message', ('Server', 'Die is goed! ' + socket.username + ' +1'));
            randomMovie();
        } else{
            io.to(catogory).emit('chat_message',  '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message + ' is fout!'); 
        }
    });

    function randomMovie(){
        counter++;
        io.to(catogory).emit('chat_message', '<div class="round">' + 'Round: ' + counter + ' </div>');
        if ( counter == 10){
            movieTitle = '';
            movieHint = '';
            correctAnswer = '';
            io.to(catogory).emit('chat_message', 'Round 10 reached. Game is over!');
        } else{
    
        let categories = {
            action: 28,
            comedy: 35,
            horror: 27,
            history: 36,
            western: 37,
            animation: 16
        };

        categoryID = categories[currentGenre]; 

        
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIEDB_TOKEN}&with_genres=`+ categoryID)
        .then(async response => {
          const movieData = await response.json()
          let randomItem = movieData.results[Math.random() * movieData.results.length | 0];
    
          // Welcome current user
          let movieTitleLower = randomItem.original_title.toLowerCase();
    
          movieHint = randomItem.poster_path;
    
          movieTitle = movieTitleLower;
    
        let movies = [];
        movieData.results.forEach(function(obj) { movies.push(obj.original_title); });
    
        let possible_answers = [movieTitle, movies[Math.random() * movies.length | 0], movies[Math.random() * movies.length | 0]];
    
        // Durstenfeld shuffle
        for(var i = possible_answers.length -1; i > 0; i--){
            var j = Math.floor(Math.random() * (i + 1));
            var temp = possible_answers[i];
            possible_answers[i] = possible_answers[j];
            possible_answers[j] = temp;
        }
    
          let answers = {
            a: possible_answers[0].toLowerCase(),
            b: possible_answers[1].toLowerCase(),
            c: possible_answers[2].toLowerCase()
        };
    
        correctAnswer  = Object.keys(answers).find(key => answers[key] == movieTitle);
    
          io.to(catogory).emit('chat_message', ('server', '<div class="server">' +
          'What movie is this?' + '</strong>' + "<br>" + randomItem.overview  +
          '<br><br>' +  'a) ' + answers.a + '<br>' +  'b) ' + answers.b + '<br>' +  'c) ' + answers.c +'<br><br>' + '</div>'));
        })
      }
    }

});
});




const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));