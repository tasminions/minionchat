var fs = require('fs');


function router(req, res){
  var url = req.url;
  console.log("urlsss" , url)
  if(url === "/"){
    // index page
    respondWithFile('/public/index.html', 'html', res);
    console.log("jsjsjsjs");

  } else if(url.indexOf('.') > -1 && url.search('/public') === 0){
    // public resources
    var ext = req.url.split('.')[1];
    respondWithFile(req.url, ext, res);
    console.log("ksjdbfajfbksdfhb");

  } else if(url.indexOf("/main/")>-1){
    console.log(url);
    respondWithFile('/public/chat.html','html',res);
    console.log("you are on the main room");
  }
    else {
    // 404
    respondWithFile('/public/404.html', 'html', res);
    console.log("hehehehehe");
  }
}

function respondWithFile(path, ext, res) {
  fs.readFile(__dirname + '/..' + path, function(error, content) {
    if (error) {
      console.log(error);
      res.writeHead(500, {"Content-Type": "text/html"});
      res.end(error.toString('utf8'));
    } else {
      res.writeHead(200, {"Content-Type": "text/" + ext});
      res.end(content.toString('utf8'));
    }
  });
}


module.exports = router;
