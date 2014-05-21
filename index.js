var config = require('./config');
var Twit = require('twit');

var T = new Twit(config.twit);

var stream = T.stream('statuses/filter', {locations: [ '-122.75', '36.8', '-121.75', '37.8' ]});
var i = 0;

stream.on('tweet', function(tweet) {
  if (i < 1) {
    i++;
    console.log(tweet);
  }
  else {
    stream.stop();
  }
});
