var db = require("../server/db.js")

module.exports = {

  init: function(server, redisClient) {

    var io = require('socket.io').listen(server);

    io.on("connection", function(socket){

      // User connection handler
      socket.on("userJoin", function(data){
        db.addUser(redisClient, data.username, data.room, function(msgHistory) {
          io.sockets.in(socket.id).emit(msgHistory)
        })

        socket.username = data.username
        socket.room = data.room
        socket.join(data.room)

        // Get an array of active users in the current room
        var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)
        names = ids.map(id => io.sockets.connected[id].username)

        // Have to use sockets.in instead because broadcast.to isnt working!!
        io.sockets.in(data.room).emit("activeUsers", {
          newUser: data.username,
          room: data.room,
          activeUsers: names,
        })
      })

      // User message handler
      socket.on('sendChat', function(data) {
        console.log("heres the data! ", data);
      })
    })
  },

  kill: function() {
    // redisClient.end()
  }
}
