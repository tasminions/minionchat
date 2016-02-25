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
  socket.on('userJoin', function(username){
    appendItemToList("allMessages").innerHTML = username + " has joined the PARTAY";
  });

  socket.on('msgHistory',function( msgHistory ){
    var ulList = document.getElementById('allMessages');
    ulList.innerHTML = "";
    var msgHistoryArr =  msgHistory;
    msgHistoryArr.forEach( function( messageObj ){
      appendItemToList('allMessages').innerHTML = "Time: " + messageObj.time + " - " + messageObj.originator + " said: " + messageObj.body;
    });
  });

  socket.on('activeUsers',function(activeUsers){
    // reset the active users list
    var ulList = document.getElementById('activeUsers');
    ulList.innerHTML = "";
    // repopulate the active users list with all active users
    var activeUsersArr = activeUsers;
    activeUsersArr.forEach(function(activeUser){
      var liNode = appendItemToList("activeUsers");
      var aNode = document.createElement('a');
      aNode.href = newChatUrl(username,activeUser);
      aNode.target = '_blank';
      liNode.appendChild(aNode);
      aNode.innerHTML = activeUser;
      aNode.id = activeUser;
    });
  });

  document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    var messageObj = createMessageObj(username, room);
    appendItemToList("allMessages").innerHTML = "Time: " + messageObj.time + " - " + messageObj.originator + " said: " + messageObj.body;

    var chatObj = messageObj;
    socket.emit('sendChat', chatObj);
  });
  socket.on("updateChat", function(message){
    // will update everyone's chat

  });

  // // "TYPING EVENT" EMITTERS AND LISTENERS
  // document.getElementById('sendChat').addEventListener('input', function(){
  //
  //   socket.emit( "userIsTyping", connectionInfo );
  // });
  // socket.on('userIsTyping',function( userTyping ){
  //   typing = true;
  //   document.getElementById( userTyping ).innerHTML += ' is typing...';
  //   setTimeout(function(){
  //     document.getElementById( userTyping ).innerHTML -= ' is typing...';
  //   },3000);
  // });

});


function appendItemToList(list){
  var ulList = document.getElementById(list);
  var liNode = document.createElement('li');
  ulList.appendChild(liNode);
  return liNode;
}
function createMessageObj(username, room){
  return {
    "originator": username,
    "body": document.getElementById('sendChat').value,
    "time": Date.now(),
    "room": room
  };
}
// create a two-way chat url based on alphabetical order
function newChatUrl(currUser,otherUser){
  var urlPart1 = currUser < otherUser ? '/'+currUser+'&'+otherUser : '/'+otherUser+'&'+currUser;
  return urlPart1+'/?username='+currUser;
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
