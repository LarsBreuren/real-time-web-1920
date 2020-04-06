var app = require('express')();
const express = require('express');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
    res.render('index');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });

  const port = process.env.PORT || 3000;

http.listen(port, function(){
  console.log('listening on port: ' + port);
});