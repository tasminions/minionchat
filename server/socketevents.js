var db = require("../server/db.js")

module.exports = {

  init: function(server, redisClient) {

    var io = require('socket.io').listen(server);

    io.on("connection", function(socket){
      // Diagnostics
      console.log('Socket with id "' + socket.id + '" has connected');
      socket.on('disconnect', function() {
        console.log('Socket with id "' + socket.id + '" has disconnected');
      })

      // User connection handler
      socket.on("userJoin", function(data){
        db.addUser(redisClient, data.username, data.room, function(msgHistory) {
          io.sockets.in(socket.id).emit('messageHistory', msgHistory)
        })

        socket.username = data.username
        socket.room = data.room
        socket.join(data.room)

        // Get an array of active users in the current room
        var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)
        names = ids.map(id => io.sockets.connected[id].username)

        // Have to use sockets.in instead because broadcast.to doesn't work??!!
        io.sockets.in(data.room).emit("activeUsers", {
          newUser: data.username,
          room: data.room,
          activeUsers: names,
        })
      })

      // User message handler
      socket.on('sendChat', function(data) {
        db.addMessage(redisClient, data.sender, data.room, data.message, data.time, function() {
          io.sockets.in(socket.id).emit('updateChat', {success: true, message: "Message stored"})
        })
        socket.broadcast.to(data.room).emit('updateChat', data)
      })
    })
  }
}
