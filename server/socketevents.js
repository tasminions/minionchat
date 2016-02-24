var db = require("../server/db.js")
var redis = require('redis')
var client = redis.createClient()

module.exports = function(server) {

  var io = require('socket.io').listen(server);

  io.on("connection", function(socket){
    socket.on("userJoin", function(data){
      data = JSON.parse(data)
      db.addUser(client, data.username, data.room, function(){})

      socket.room = data.room
      socket.join(data.room)

      // Have to use sockets.in instead because broadcast.to isnt working!!
      io.sockets.in('room1').emit("userJoin", JSON.stringify(data))

    })
  })
}
