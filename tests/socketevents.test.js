var env2 = require('env2')('./config.env')
var http = require('http')
var redis = require('redis')
var ioClient = require('socket.io-client')
var tape = require('wrapping-tape')
var router = require('../server/router.js')
var sck = require("../server/socketevents.js")

var port = process.env.PORT || 8000
var dbUrl = process.env.REDIS_URL || 'redis://localhost:6379'
var dbNum = process.env.REDIS_DB || 16

var test = {}, socket0, socket1, client
var server = http.createServer(router)

function createSocketClient() {
  var socket = ioClient.connect('http://localhost:' + port, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true
  })
  socket.on('connect', function() {
    console.log('Socket with id "' + socket.id + '" has connected');
  })
  return socket
}

test.module1 = tape({
  setup: function(t){
    client = redis.createClient(dbUrl)
    client.select(dbNum, function() {
      console.log('Connected to Redis database number ' + dbNum);
    })

    server.listen(port, function(){
      console.log("listening on port "+ port);
      sck.init(server, client);
    });
    socket0 = createSocketClient()
    socket1 = createSocketClient()
    t.end()
  },

  teardown: function(t){
    socket0.disconnect()
    socket1.disconnect()
    client.end()
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
  socket0.emit('userJoin', emission)

  // Assert that user 1 gets the expected data back
  // Active users should return a list of all users in the current room
  socket0.on('activeUsers', function(response) {
    t.equal(response.newUser, emission.username, "Listen for username of joining user")
    t.equal(response.room, emission.room, "Listen for room of joining user")
    t.deepEqual(response.activeUsers, [emission.username], "Assert for list of active users")
    t.end()
  })
})

test.module1("test that messages are stored in the database", function(t){
  // Join room 1
  socket0.emit('userJoin', {username: 'sylvester', room: 'room1'})
  socket1.emit('userJoin', {username: 'tweety', room: 'room1'})

  var time = new Date(Date.now()).toISOString();

  var messageObj = {sender: 'sylvester', room: 'room1', body: 'test message', time: time}
  var messageFromServer = {success: true, message: "Message stored"};
  socket0.emit("sendChat", messageObj)
  socket0.on("messageStored", function(response) {
    t.deepEqual(response, messageFromServer, "Listen for confirmation that the message has been stored")
  })
  socket1.on('updateChat', function(response) {
    t.deepEqual(response, messageObj, "Assert other users in room get message object")
  })

  t.plan(2)
})

test.module1("test can send private chat invite", function(t) {
  socket0.emit('userJoin', {username: 'bugs_bunny', room: 'main'})
  socket1.emit('userJoin', {username: 'doc', room: 'main'})

  socket0.emit('userJoin', {username: 'bugs_bunny', room: 'bugs&doc'})
  socket0.emit('newRoom', {sourceUser: 'bugs_bunny', targetUser: 'doc', room: 'bugs&doc'})

  socket1.on('newRoom', function(data) {
    t.equal(data.sourceUser, 'bugs_bunny', 'Assert source user is as expected')
    t.equal(data.targetUser, 'doc', 'Assert target user is as expected')
    t.equal(data.room, 'bugs&doc', 'Assert room is as expected')
    t.equal(data.url, '/bugs&doc/?username=doc', 'Assert source user is as expected')
    t.end()
  })
})

test.module1("test the user-typing functionality", function(t) {
  var user1 = {username: 'bugs_bunny', room: 'main'}
  var user2 = {username: 'doc', room: 'main'}
  socket0.emit('userJoin', user1)
  socket1.emit('userJoin', user2)

  socket0.emit('userTyping', user1)
  socket1.on('userTyping', function(data) {
    t.deepEqual(data, user1, 'User is typing data is as expected')
    t.end()
  })
})
