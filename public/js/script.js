var socket = io.connect('http://localhost:8000');

socket.on('connect',function(){
  var urlParams = document.URL.split('/');
  var username = urlParams[urlParams.length-1].replace('?username=','');
  var room = urlParams[urlParams.length-2];
  console.log(room);
  console.log(username);
  var typing = false;
  var connectionInfo = {username:username, room:room};
  document.getElementById('roomName').innerHTML = room;
  socket.emit('userJoin',connectionInfo);
  if(room !== "main"){
    var newRoomObj = {
      username: username,
      username2: room.split("&")[1],
      room: room
    }
    socket.emit("newRoom", newRoomObj);
  }
  socket.on('messageHistory',function( msgHistory ){
    console.log("message history", msgHistory)
    var ulList = document.getElementById('allMessages');
    ulList.innerHTML = "";
    var msgHistoryArr =  msgHistory;
    msgHistoryArr.forEach( function( messageObj ){
      newMessage(messageObj)
    });
  });

  socket.on('activeUsers',function(activeUsersObj){
    // reset the active users list
    var ulList = document.getElementById('activeUsers');
    ulList.innerHTML = "";
    // repopulate the active users list with all active users
    var activeUsersArr = activeUsersObj.activeUsers;
    console.log(activeUsersArr)
    activeUsersArr.forEach(function(activeUser){
      var liNode = appendItemToList("activeUsers");
      var aNode = document.createElement('a');
      aNode.href = newChatUrl(username,activeUser);
      aNode.target = '_blank';
      liNode.appendChild(aNode);
      aNode.innerHTML = activeUser;
      aNode.id = activeUser;
    });
    if(activeUsersObj.newUser !== username){
      console.log("running");
      appendItemToList("allMessages").innerHTML = "Time:" + Date.now() + activeUsersObj.newUser + " has joined the room";
    }
  });

  document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    var messageObj = createMessageObj(username, room);
    newMessage(messageObj);
    var chatObj = messageObj;
    socket.emit('sendChat', chatObj);
  });
  socket.on("updateChat", function(message){
    console.log(message);
    newMessage(message);
  });
  socket.on("newRoom", function(roomInvitation){
    appendItemToList("allMessages").innerHTML = "<a href=" + roomInvitation.url +">" + roomInvitation.sourceUser + "has invited you to chat privately. </a>";

  })

  // "TYPING EVENT" EMITTERS AND LISTENERS
  document.getElementById('sendChat').addEventListener('input', function(){

    socket.emit( "userIsTyping", connectionInfo );
  });
  socket.on('userIsTyping',function( userTyping ){
    typing = true;
    document.getElementById( userTyping ).innerHTML += ' is typing...';
    setTimeout(function(){
      document.getElementById( userTyping ).innerHTML -= ' is typing...';
    },3000);
  });

});


function appendItemToList(list){
  var ulList = document.getElementById(list);
  var liNode = document.createElement('li');
  ulList.appendChild(liNode);
  return liNode;
}
function createMessageObj(username, room){
  return {
    "sender": username,
    "message": document.getElementById('sendChat').value,
    "time": Date.now(),
    "room": room
  };
}
// create a two-way chat url based on alphabetical order
function newChatUrl(currUser,otherUser){
  var urlPart1 = currUser < otherUser ? '/'+currUser+'&'+otherUser : '/'+otherUser+'&'+currUser;
  return urlPart1+'/?username='+currUser;
}

function newMessage(messageObject){
  appendItemToList('allMessages').innerHTML = "Time: " + messageObject.time + " - " + messageObject.sender + " said: " + messageObject.message;
}

// var typing = false;
// var timeout = undefined;
//
// function timeoutFunction(){
//   typing = false;
//   socket.emit(noLongerTypingMessage);
// }
//
// function onKeyDownNotEnter(){
//   if(typing == false) {
//     typing = true
//     socket.emit(typingMessage);
//     timeout = setTimeout(timeoutFunction, 5000);
//   } else {
//     clearTimeout(timeout);
//     timeout = setTimeout(timeoutFunction, 5000);
//   }
//
// }
