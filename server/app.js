var http = require('http');
var env2 = require('env2')("./config.env");
var router = require('./router.js');
var sck = require('./socketevents.js');
var port = process.env.PORT || 8000;


var server = http.createServer(router);
server.listen(port, function(){
  console.log("listening on port "+ port);
  sck(server);
});
