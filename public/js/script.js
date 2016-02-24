var socket = io.connect('http://localhost:8000');
socket.on('connect',function(){
  var nickname = document.URL.split('nickname=')[1];
  console.log(nickname);
  socket.emit('userJoin',nickname);
});
