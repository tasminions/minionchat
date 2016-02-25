var db = require("../server/db.js")

module.exports = {

  init: function(server, redisClient) {

    var io = require('socket.io').listen(server);

    io.on("connection", function(socket){
      // Diagnostics
      console.log('Socket with id "' + socket.id + '" has connected');
      socket.on('disconnect', function() {
        // emit a user has left event
        console.log('Socket with id "' + socket.id + '" has disconnected');
      })

      // User connection handler
      socket.on("userJoin", function(data){
        db.addUser(redisClient, data.username, data.room, function(msgHistory) {
          io.sockets.in(socket.id).emit(msgHistory)
        })

        socket.username = data.username
        socket.join(data.room)

        // Get an array of active users in the current room
        var ids = Object.keys(io.sockets.adapter.rooms[data.room].sockets)
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
          io.sockets.in(socket.id).emit('messageStored', {success: true, message: "Message stored"})
        })
        socket.broadcast.to(data.room).emit('updateChat', data)
      })

      socket.on("newRoom", function(data){
        var ids = Object.keys(io.sockets.adapter.rooms.main.sockets)
        var idOfTargetUser = ids.filter(function(id){
          return data.targetUser === io.sockets.connected[id].username
        })

        var url = "/" + encodeURIComponent(data.room)
        io.sockets.in(idOfTargetUser[0]).emit("newRoom", {
          sourceUser: data.sourceUser,
          targetUser: data.targetUser,
          room: data.room,
          url: url
        })
      })
//{username: 'bugs_bunny', room: 'main'}
      socket.on("userTyping", function(data){
        socket.broadcast.to(data.room).emit("userTyping", data)
      })
    })
  }
}
