var http = require('http')
var router = require('../server/router.js')
var sck = require("../server/socketevents.js")
var ioClient = require('socket.io-client')
var tape = require('wrapping-tape')
var port = process.env.PORT || 8080

var server = http.createServer(router)
var test = {}, socket0, socket1


test.module1 = tape({
  setup: function(t){
    server.listen(port, function(){
      console.log("listening on port "+ port);
      sck(server);
    });
    socket0 = ioClient.connect('http://localhost:' + port, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true
    })
    socket1 = ioClient.connect('http://localhost:' + port, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true
    })
    t.end()
  },

  teardown: function(t){
    server.close()
    t.end()
  }
})

test.module1("userJoin event adds user to db and responds with message history", function(t){
  // Test data
  var emission = {
    username: 'sylvester',
    room: 'room1'
  }

  // Have user 0 join the room
  socket0.emit('userJoin', JSON.stringify(emission))

  // Assert that user 1 gets the expected data back
  // Active users should return a list of all users in the current room
  socket0.on('activeUsers', function(response) {
    response = JSON.parse(response)
    console.log("response: ", response);
    t.equal(response.username, emission.username, "Listen for username of joining user")
    t.equal(response.room, emission.room, "Listen for room of joining user")
    t.end()
  })
})

test.module1("test that messages are stored in the database", function(t){
  var messageObj = {sender: "bugs-bunny", body:"test message", time: new Date(Date.now()).toISOString()}
  var messageFromServer = "Message stored"
  socket0.emit("")
  socket0.emit("sendChat", JSON.stringify(messageObj))
  socket0.on("updateChat", function(response){
    t.equal(response, messageFromServer, "Listen for confirmation that the message has been stored")
  })
})
