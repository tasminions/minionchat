var http = require('http');
var env2 = require('env2')("./config.env");
var port = process.env.PORT || 8000;
var router = require('./router.js');

http.createServer(router).listen(port, function(){
  console.log("listening on port "+port);
});
