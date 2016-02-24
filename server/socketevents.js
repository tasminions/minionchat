


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
      var testMsgHist = JSON.stringify([
            {
                "originator":"bugs",
                "body":"here is a message",
                "time":"24-01-2016:12.123321321312"
            },
            {
              "originator":"daffy",
              "body":"here is a message2",
              "time":"24-01-2016:12.123321321312"
            },
            {
              "originator":"me",
              "body":"here is not a message",
              "time":"24-01-2016:12.123321321312"
            }
        ]);
      var activeUsers = JSON.stringify(["dafyy","bugs","popeye"]);
      socket.emit('msgHistory',testMsgHist);
      socket.emit('activeUsers',activeUsers)
    });
  });
};
