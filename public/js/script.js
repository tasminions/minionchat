//
// when you add your user name
document.querySelector('form').addEventListener('submit', function(e){
  e.preventDefault();
  var nickname = document.getElementById('nickname').value;
  var req = new XMLHttpRequest();
  var url = "/main/"+nickname;
  console.log(url);
  req.onreadystatechange = function(){
    if (req.statusCode === 200 && req.readystate === 400){
      console.log("hey hey");

    }
  };
  req.open("GET", url);
  req.send();
});
