var socket = io.connect('http://localhost:8000');
socket.on('connect',function(){
  var nickname = document.URL.split('nickname=')[1];
  console.log(nickname);
  socket.emit('userJoin',nickname);
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
      var liNode = document.createElement('li');
      liNode.innerHTML = activeUser;
      ulList.appendChild(liNode);
    });
  });
});
