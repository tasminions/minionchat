


// console.log(sckt);
// socket listener for user joining a room



// / newUser - when a new user joins
function newUser(nickname, users, currRoom){
  if( users[nickname] === undefined ) {
    users[nickname] = {
      "rooms": [currRoom]
    };
  }
  else {
    users[nickname].rooms.push(currRoom);
  }
  return users;
}



module.exports = function(server) {
  var sckt = require('socket.io')(server);
  sckt.sockets.on("connection", function(socket){
    socket.on('userJoin', function(nickname){
    console.log(nickname);
    });
  });
};
