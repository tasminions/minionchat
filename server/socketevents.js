var server = require('./server/app.js')
var sckt = require('socket.io').listen(server);

console.log(sckt);
// socket listener for user joining a room
sckt.sockets.on('userJoin',function(nickname){
  console.log(nickname);
});

/// newUser - when a new user joins
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



module.exports = {
  newUser: newUser
};
