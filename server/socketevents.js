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
          io.sockets.in(socket.id).emit('messageHistory', msgHistory)
        })

        socket.username = data.username
        socket.join(data.room)

        // Get an array of active users in the current room

        names = updateNames(data)

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
        console.log("dta", data)
        var ids = Object.keys(io.sockets.adapter.rooms.main.sockets)
        var idOfTargetUser = ids.filter(function(id){
          return data.targetUser === io.sockets.connected[id].username
        })

        var url = "/" + data.room + "/?username="+data.targetUser
        io.sockets.in(idOfTargetUser[0]).emit("newRoom", {
          sourceUser: data.sourceUser,
          targetUser: data.targetUser,
          room: data.room,
          url: url
        })
      })
      socket.on("userTyping", function(data){
        socket.broadcast.to(data.room).emit("userTyping", data)
      })
      socket.on('userLeave',function(connectionInfo){
        // // Get an array of active users in the current room

        // console.log(ids);
        // console.log(names);
        socket.leave(connectionInfo.room)
        socket.broadcast.to(connectionInfo.room).emit('userLeave',connectionInfo);
        socket.broadcast.to(connectionInfo.room).emit('activeUsers',{activeUsers: updateNames(connectionInfo)});
        console.log('broadcasting to',connectionInfo.room,' that ',connectionInfo.username,' has left');
      });
      function updateNames(infoObj){
        var ids = Object.keys(io.sockets.adapter.rooms[infoObj.room].sockets);
        names = ids.map(id => io.sockets.connected[id].username);
        return names

      }

    })
  }

}
