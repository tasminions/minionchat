var http = require('http');
var env2 = require('env2')("./config.env");
var router = require('./router.js');
var sck = require('./socketevents.js');
var port = process.env.PORT || 8000;


var server = http.createServer(router);
server.listen(port, function(){
  console.log("listening on port "+port);
  sck(server);
});

// var sckt = require('socket.io').listen(server);
//
// sckt.sockets.on("connection", function(socket){
//   socket.on('userJoin', function(nickname){
//   console.log(nickname);
//   });
// });



// module.exports = server;
