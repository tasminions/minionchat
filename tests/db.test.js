var tape = require('wrapping-tape');
var redis = require("redis");
var db = require('../server/db.js')
var client, test = {};

test.module1 = tape({
  setup: function(t){
    client = redis.createClient()
    client.select(1, function(){
      console.log("connected to database 1")
    })
    t.end()
  },
  teardown: function(t){
    client.flushdb()
    client.end()
    t.end()
  }

})

test.module1("test that users can be added to the database", function(t){
  var username = "bugs-bunny"
  var room = "room1"
  db.addUser(client, username, room, function(messageHistory){
    t.deepEqual(messageHistory, [], "messageHistory should be empty for new rooms")

    client.sismember("users_in_" + room, username, function(error, reply){
      t.ok(!error, "Assert user has been successfully added")
      t.ok(reply, "Assert that user has been added to 'users_in_" + room + "' set")
    })

    client.sismember("rooms", room, function(error, reply) {
      t.ok(! error, "Assert no error")
      t.ok(reply, "Assert room has been added")
    })
  });

  t.plan(5)
})

// TODO: Add test for successfully returning a message history
// TODO: Add test for users in multiple rooms

test.module1("test messages can be logged in the database", function(t) {
  var username = "micky mouse"
  var room = "cooking"
  var message = "hey man, what is up?"
  var time = new Date(Date.now()).toISOString()
  console.log(time);

  db.addUser(client, username, room, function(){
    db.addMessage(client, username, room, message, time, function() {
      client.lrange('messages_in_' + room, 0, -1, function(error, reply) {
        t.ok(! error, 'Assert that messages have been successfully added')
        console.log(reply);
        reply = reply.map(JSON.parse)
        t.equal(reply.length, 1, "Assert only one message has been added")
        t.equal(reply[0].sender, username, "Assert correct user has sent the message")
        t.equal(reply[0].message, message, "Assert message has been stored correctly")
        t.equal(reply[0].time, time, "Assert message time has been added")
        t.end()
      })
    })
  })
})
