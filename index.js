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

io.sockets.on('connection', function(socket) {
    socket.on('create', function(catogory) {
        socket.join(catogory);

        let url = 'https://image.tmdb.org/t/p/w500/'

        io.sockets.adapter.rooms[catogory].correctAnswer = '';
        io.sockets.adapter.rooms[catogory].movieHint = '';
        io.sockets.adapter.rooms[catogory].movieTitle = '';
        io.sockets.adapter.rooms[catogory].counter = 0;
        io.sockets.adapter.rooms[catogory].currentGenre = catogory;
        io.sockets.adapter.rooms[catogory].roomUsers = io.sockets.adapter.rooms[catogory];
        let number =   io.sockets.adapter.rooms[catogory].length;
   
    socket.join('some room');
    socket.emit('chat_message', ('server', '<div class="server">' + 'Welcome to real time chat!' + "<br>" + '<strong>' + 'Type /help to get a hint' + '<br>' +
      'Type /start to start' + '<br>' + 'or /skip to skip the current movie' + '</div>'));
     
    socket.on('username', function(username, score) {
        socket.username = username;
        socket.score = score;
        io.to(catogory).emit('is_online', '<div class="server"> <i>' + socket.username + ' ' + '[' + socket.score + ']' + ' joined the chat' +  '<br>' + 'Total players: ' +
        io.sockets.adapter.rooms[catogory].roomUsers.length +  '</i> </div>');
    });

    socket.on('disconnect', function(username) {
     if (number <= 1 ){
        console.log( 'No ones left 0.o')
     } else{
        io.to(catogory).emit('is_online', '<div class="server"> <i>' + socket.username + ' left the chat. ' + '<br>' +  'Total players: ' +
        io.sockets.adapter.rooms[catogory].roomUsers.length +  '</i> </div>');  
     }
    })


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

    function randomMovie(){
        io.sockets.adapter.rooms[catogory].counter++;
        
        io.to(catogory).emit('chat_message', '<div class="round">' + 'Round: ' + io.sockets.adapter.rooms[catogory].counter + ' </div>');
        if ( io.sockets.adapter.rooms[catogory].counter == 10){
            io.sockets.adapter.rooms[catogory].movieTitle = '';
            io.sockets.adapter.rooms[catogory].movieHint = '';
            io.sockets.adapter.rooms[catogory].correctAnswer = '';
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

        categoryID = categories[  io.sockets.adapter.rooms[catogory].currentGenre]; 

        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIEDB_TOKEN}&with_genres=`+ categoryID)
        .then(async response => {
            const movieData = await response.json();
            let movies = [];

            let correct_answer = movieData.results.splice(Math.random() * movieData.results.length | 0, 1)[0]; // splice returnt altijd een array

            //kopieer alles naar de movie array
            movieData.results.forEach(function(obj) {
                    movies.push(obj.original_title.toLowerCase()); 
            });


            io.sockets.adapter.rooms[catogory].movieHint  = correct_answer.poster_path;
            io.sockets.adapter.rooms[catogory].movieTitle = correct_answer.title;
                
            let possible_answers = [correct_answer.title, movies.splice(Math.random() * movies.length | 0, 1)[0], movies.splice(Math.random() * movies.length | 0, 1)[0]];
        
            // Durstenfeld shuffle
            for(var i = possible_answers.length -1; i > 0; i--){
                var j = Math.floor(Math.random() * (i + 1));
                var temp = possible_answers[i];
                possible_answers[i] = possible_answers[j];
                possible_answers[j] = temp;
            }
        
            let answers = {
                a: possible_answers[0],
                b: possible_answers[1],
                c: possible_answers[2]
            };
        
        io.sockets.adapter.rooms[catogory].correctAnswer = Object.keys(answers).find(key => answers[key] ==     io.sockets.adapter.rooms[catogory].movieTitle); 
        
          io.to(catogory).emit('chat_message', ('server', '<div class="server question">' +
          '<h2>What movie is this?</h2>' + '</strong>' + "<br>" + correct_answer.overview  +
          '<br><br>' +  'a) ' + answers.a + '<br>' +  'b) ' + answers.b + '<br>' +  'c) ' + answers.c +'<br><br>' + '</div>'));
        })
      }
    }

    socket.on('answer_message', function(message) {
        if (message == io.sockets.adapter.rooms[catogory].correctAnswer) {
            socket.score++
            io.to(catogory).emit('chat_message',  '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message ); 
            io.to(catogory).emit('chat_message', ('Server', '<div class="server">' +  message + ' is goed! ' + socket.username + ' +1 </div>'));
            setTimeout( randomMovie, 1500);
        } else{
            io.to(catogory).emit('chat_message',  '<strong>' + socket.username + '[' + socket.score + ']' + '</strong>: ' + message + ' is fout!'); 
        }
    });
});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));