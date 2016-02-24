
function addUser(client, username, room, callback) {
  client.sadd('rooms', room)
  client.sadd('users_in_' + room, username)
  client.lrange('messages_in_' + room, 0, -1, function(error, reply) {
    if (error) {
      console.log(error);
    } else {
      callback(reply.map(JSON.parse))
    }
  })
}

function addMessage(client, username, room, message, time, callback){
  //room exists
  client.sismember("rooms", room, function(error, reply){
    if(reply){
      client.sismember("users_in_" + room, username, function(error, reply){
        if(reply){
          client.rpush("messages_in_" + room, JSON.stringify({sender: username, message: message, time: time}), callback)
        } else {
          console.log(username + " is not a member of room " + room);
        }
      })
    } else {
      console.log(username + " does not exist");
    }
  })
}

module.exports = {
  addUser: addUser,
  addMessage: addMessage
}
