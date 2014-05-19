var config = require('./config');
var Twit = require('twit');

var T = new Twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
});

var stream = T.stream('statuses/sample');
var i = 0;

console.log('The Stream: ' + stream);
console.log();

stream.on('tweet', function(tweet) {
  if (i < 10) {
    i++;
    console.log(tweet.user.name);
  }
  else {
    stream.stop();
  }
});
