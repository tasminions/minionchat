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
      sourceUser: username,
      targetUser: room.replace(username, "").replace("&",""),
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
    console.log(activeUsersArr);
    activeUsersArr.forEach(function(activeUser){
      if(activeUser !== username){
        var liNode = appendItemToList("activeUsers");
        var aNode = document.createElement('a');
        aNode.href = newChatUrl(username,activeUser);
        aNode.target = '_blank';
        liNode.appendChild(aNode);
        aNode.innerHTML = activeUser;
        aNode.id = activeUser;
    }
    });
    if(activeUsersObj.newUser && activeUsersObj.newUser !== username){
      console.log("running");
      var newUserMsg = appendItemToList("allMessages");
      newUserMsg.innerHTML = "Time:" + Date.now() + activeUsersObj.newUser + " has joined the room";
      newUserMsg.style["font-style"] = "italic";
    }
  });

  document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    var messageObj = createMessageObj(username, room);
    newMessage(messageObj);
    var chatObj = messageObj;
    socket.emit('sendChat', chatObj);
    document.getElementById('sendChat').value = ""
  });
  socket.on("updateChat", function(message){
    newMessage(message);
  });
  socket.on("newRoom", function(roomInvitation){
    console.log("room invitation", roomInvitation);
    appendItemToList("allMessages").innerHTML = "<a href=" + roomInvitation.url +" target='_blank'>" + roomInvitation.sourceUser + "has invited you to chat privately. </a>";
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
  window.onbeforeunload = function(e){
    socket.emit('userLeave',connectionInfo);
  }
  socket.on('userLeave',function( info ){
    var userLeftMsg = appendItemToList("allMessages");
    userLeftMsg.innerHTML = "Time:" + Date.now() + info.username + " has left the room";
    userLeftMsg.style["font-style"] = "italic";
  })
});


function appendItemToList(list){
  var ulList = document.getElementById(list);
  var liNode = document.createElement('li');
  ulList.appendChild(liNode);
  scrollDown("main");
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
function scrollDown(listClass){
  var div = document.getElementsByClassName(listClass)[0];
  div.scrollTop = div.scrollHeight;
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
