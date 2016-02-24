var env2 = require('env2')("./config.env");
var http = require('http');
var redis = require('redis')
var router = require('./router.js');
var sck = require('./socketevents.js');

var port = process.env.PORT || 8000
var dbUrl = process.env.REDIS_URL || 'redis://localhost:6379'
var dbNum = process.env.REDIS_DB || 0

var client = redis.createClient(dbUrl)
client.select(dbNum, function() {
  console.log('Connected to Redis database number ' + dbNum);
})

var server = http.createServer(router);
server.listen(port, function(){
  console.log("listening on port "+ port);
  sck.init(server, client);
});
