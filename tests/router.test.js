var fs = require('fs')
var http = require('http')
var hyperquest = require('hyperquest')
var concat = require('concat-stream')
var tape = require('tape')
var router = require('../server/router.js')

var server = http.createServer(router)
var port = process.env.PORT || 8080
var hostUrl = "http://localhost:" + port

server.listen(port)

tape("test index page is served", function(t){
  hyperquest.get(hostUrl, function(error, response){
    response.pipe(concat(function(payload){
      var index = fs.readFileSync(__dirname + "/../public/minions.html")
      t.equal(index.toString('utf8'), payload.toString('utf8'), "html sent")
      t.end()
    }))
  })
})

tape("test that 404 page is served", function(t) {
  hyperquest.get(hostUrl + '/doesntexist', function(error, response) {
    response.pipe(concat(function(payload) {
      var notFound = fs.readFileSync(__dirname + "/../public/404.html")
      t.equal(notFound.toString('utf8'), payload.toString('utf8'), "404 page sent")
      t.end()
    }))
  })
})

tape("test that css file is served", function(t){
  hyperquest.get(hostUrl + "/public/css/minions.css", function(error, response){
    response.pipe(concat(function(payload){
      var css = fs.readFileSync(__dirname + "/../public/css/minions.css")
      t.equal(css.toString('utf8'), payload.toString('utf8'), "css sent")
      t.end()
    }))
  })
})

tape("test can visit main chat room", function(t){
  hyperquest.get(hostUrl + "/minions/main/?username=bug", function(error, response){
    response.pipe(concat(function(payload){
      var chat = fs.readFileSync(__dirname + "/../public/minionsChat.html")
      t.equal(chat.toString('utf8'), payload.toString('utf8'), "chat html sent")
      t.end()
    }))
  })
})
tape("test that looneys join theme is loaded on /looneys request",function(t){
  hyperquest.get(hostUrl+"/looneys",function(error,response){
    response.pipe(concat(function(payload){
      var looneysIndex = fs.readFileSync(__dirname+"/../public/looneys.html");
      t.equal(looneysIndex.toString('utf8'),payload.toString('utf8'),"looneys html loaded on looneys joinus page");
      t.end();
    }));
  });
});

tape("test that looneys join theme is loaded on /looneys request",function(t){
  hyperquest.get(hostUrl+"/looneys/main/?username=daffy",function(error,response){
    response.pipe(concat(function(payload){
      var looneysIndex = fs.readFileSync(__dirname+"/../public/looneysChat.html");
      t.equal(looneysIndex.toString('utf8'), payload.toString('utf8'),"looneys html loaded for main chat");
      t.end();
    }));
  });
});
tape("test that looneys join theme is loaded on /looneys request",function(t){
  hyperquest.get(hostUrl+"/looneys/daffy&popeye/?username=daffy",function(error,response){
    response.pipe(concat(function(payload){
      var looneysIndex = fs.readFileSync(__dirname+"/../public/looneysChat.html");
      t.equal(looneysIndex.toString('utf8'), payload.toString('utf8'),"looneys html loaded for private chats");
      t.end();
    }));
  });
});
tape("test that server 500 code is sent back if wrong route is sent",function(t){
  hyperquest.get(hostUrl+"/public/ooooopsyyyy.html",function(error,response){
      var goofStatus = response.statusCode;
      t.equal(goofStatus,500,"error returned");
      t.end();
  });
});


tape.onFinish(function() {
  server.close()
})
