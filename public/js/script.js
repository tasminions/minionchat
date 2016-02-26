var socket = io.connect();
var icon;

socket.on('connect',function(){
  var urlParams = document.URL.split('/');
  var username = urlParams[urlParams.length-1].replace('?username=','')
  username = decodeURIComponent(username).replace(/\+/g," ")
  var room = urlParams[urlParams.length-2];
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
    console.log(msgHistoryArr);
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
      newUserMsg.innerHTML = formatTime(Date.now())+ activeUsersObj.newUser + " has joined the room";
      newUserMsg.style["font-style"] = "italic";
      scrollDown('main');
    }
  });

  var iconNames = document.getElementsByClassName('icon')
  for(i = 0; i < iconNames.length; i++) {
    iconNames[i].addEventListener("click", addIcon)
  }

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
    appendItemToList("allMessages").innerHTML = "<a href=" + roomInvitation.url +" target='_blank'>" + roomInvitation.sourceUser + " has invited you to chat privately. </a>";
  })


  // "TYPING EVENT" EMITTERS AND LISTENERS
  document.getElementById('sendChat').addEventListener('input', function(){
    socket.emit( "userTyping", connectionInfo );
  });
  socket.on('userTyping',function( data ){
    console.log('typing');
    var userTyping = data.username;
    document.getElementById( userTyping ).classList.add('typing');
    setTimeout(function(){
      document.getElementById( userTyping ).classList.remove('typing');
    },3000);
  });
  window.onbeforeunload = function(e){
    socket.emit('userLeave',connectionInfo);
  };
  socket.on('userLeave',function( info ){
    var userLeftMsg = appendItemToList("allMessages");
    userLeftMsg.innerHTML = formatTime(Date.now()) + info.username + " has left the room";
    userLeftMsg.style["font-style"] = "italic";
    scrollDown('main');
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
    "message": document.getElementById('sendChat').value || icon,
    "time": formatTime(Date.now()),
    "room": room
  }; //
}
// create a two-way chat url based on alphabetical order
function newChatUrl(currUser,otherUser){
  var urlPart1 = currUser < otherUser ? '/'+currUser+'&'+otherUser : '/'+otherUser+'&'+currUser;
  return urlPart1+'/?username='+currUser;
}

function newMessage(messageObject){
  appendItemToList('allMessages').innerHTML = messageObject.time + " - " + "<span style='color:#91A2C1'>" + messageObject.sender + "</span> " + " said: " + messageObject.message;
  setTimeout( function(){ scrollDown("main") }, 100 );
}

function scrollDown(listClass){
  var div = document.getElementsByClassName(listClass)[0];
  div.scrollTop = div.scrollHeight;
}

function formatTime(date){
  date = new Date(date);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
}

function toAscii(ascii){
  var letters = [];
  for(i=0, j=0; i<ascii.length, j<ascii.length/2; i+=2, j++){
    var tmp1 = ascii.charAt(i);
    var tmp2 = ascii.charAt(i+1);
    letters[j]=parseInt(tmp1,16)*16+parseInt(tmp2,16);
    letters[j]=String.fromCharCode(letters[j]);
  }
  return letters.join("");
}

function addIcon(e){
  icon = e.target.outerHTML
  var messageObj = createMessageObj(username, room);
  newMessage(messageObj);
  var chatObj = messageObj;
  socket.emit('sendChat', chatObj);
}
