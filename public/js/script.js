var socket = io.connect('http://localhost:8000');

socket.on('connect',function(){
  var nickname = document.URL.split('nickname=')[1];
  console.log(nickname);
  socket.emit('userJoin',nickname);
  socket.on('userJoin', function(nickname){
    appendItemToList("allMessages").innerHTML = nickname + " has joined the PARTAY";
  });

  socket.on('msgHistory',function( msgHistory ){
    var ulList = document.getElementById('allMessages');
    ulList.innerHTML = "";
    var msgHistoryArr = JSON.parse( msgHistory );
    msgHistoryArr.forEach( function( messageObj ){
      var liNode = document.createElement('li');
      var originator = messageObj.originator;
      var msgBody    = messageObj.body;
      var msgTime    = messageObj.time;
      liNode.innerHTML = "Time: " + msgTime + " - " + originator + " said: " + msgBody;
      ulList.appendChild(liNode);
    });
  });

  socket.on('activeUsers',function(activeUsers){
    var ulList = document.getElementById('activeUsers');
    ulList.innerHTML = "";
    var activeUsersArr = JSON.parse( activeUsers );
    activeUsersArr.forEach(function(activeUser){
      appendItemToList("activeUsers").innerHTML = activeUser;
    });
  });



  document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault();
    var messageObj = createMessageObj(nickname);
    appendItemToList("allMessages").innerHTML = "Time: " + messageObj.time + " - " + messageObj.originator + " said: " + messageObj.body;
    var chatObj = JSON.stringify(messageObj);
    socket.emit('sendChat', chatObj);
  });
  socket.on("updateChat", function(message){


  });
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
  document.getElementById('sendChat').addEventListener('keyup', function(e){
      socket.emit("userIsTyping", nickname);


    })
});


function appendItemToList(list){
  var ulList = document.getElementById(list);
  var liNode = document.createElement('li');
  ulList.appendChild(liNode);
  return liNode;
}
function createMessageObj(nickname){
  return {
    "originator": nickname,
    "body": document.getElementById('sendChat').value,
    "time": Date.now()
  };
}
