var config = require('../config');
var Twit = require('twit');

exports.index = function(io) {

  return function(req, res) {

    var T = new Twit(config.twit);
    var streamSF = null;
    var users = [];

    io.sockets.on('connection', function (socket) {

      if (users.indexOf(socket.id) === -1) {
        users.push(socket.id);
      }

      console.log(users);

      socket.on('start stream', function() {
        if (streamSF === null) {
          streamSF = T.stream('statuses/filter', {locations: [ '-122.62', '37.64', '-121.98', '37.92' ]});
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

      socket.on('disconnect', function() {
        console.log('Disconnect');
        var index = users.indexOf(socket.id);
        if (index != -1) {
          users.splice(index, 1);
        }
      });
    });

    res.render('index', {
      title: 'Beats by Bay'
    });
  }
}

exports.about = function(req, res) {
  res.render('about', {
    title: 'About'
  })
}
