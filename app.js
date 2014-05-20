var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');

var app = express();

var http = require('http');
var Twit = require('twit');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

var T = new Twit(config.twit);
var streamSF = null;
var streamWorld = null;
var users = [];

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

  if (users.indexOf(socket.id) === -1) {
    users.push(socket.id);
  }

  console.log(users);

  socket.on('start stream', function() {
    if (streamSF === null) {
      streamSF = T.stream('statuses/filter', {locations: [ '-122.75', '36.8', '-121.75', '37.8' ]});
      streamSF.on('tweet', function(tweet) {
        if (users.length > 0) {
          socket.emit('sf', tweet);
        }
        else {
          console.log('Stream Shutdown')
          streamSF.stop();
          streamSF = null;
        }
      });
    }
    else {
      streamSF.on('tweet', function(tweet) {
        if (users.length > 0) {
          socket.emit('sf', tweet);
        }
      });
    }
  });
  // streamSF.on('tweet', function(tweet) {
  //   socket.emit('sf', tweet);
  // });
  // streamWorld.on('tweet', function(tweet) {
  //   socket.emit('world', tweet);
  // });
  socket.on('disconnect', function() {
    console.log('Disconnect');
    var index = users.indexOf(socket.id);
    if (index != -1) {
      users.splice(index, 1);
    }
    // streamSF.stop();
    // streamWorld.stop();
  });
});

app.get('/', function(req, res) {
  res.render('index', {
      title: 'Beats by Bay'
  });
});

app.get('/about', function(req, res) {
  res.render('about', {
    title: 'About'
  });
});
