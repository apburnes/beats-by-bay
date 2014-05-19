
// socket.on('tweet', function (data) {
//   console.log(data);
// });
function initSocket() {

  if (io !== undefined) {
    var host = window.location.host;
    var socket = io.connect(host);
    socket.on('connect', function() {
      socket.emit('start stream');
      socket.on('sf', function(data) {
        console.log('SF');
      })
    });
  }
  else {
    console.log('Not socket connection!')
  }
}

window.onload = initSocket();
