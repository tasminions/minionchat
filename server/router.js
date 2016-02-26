var fs = require('fs');


function router(req, res){
  var url = req.url;
  if(url === "/"){
    // index page
    respondWithFile('/public/minions.html', 'html', res);
  }
  else if (url === "/looneys"){
    respondWithFile('/public/looneys.html', 'html', res);
  }
  else if(url.indexOf('.') > -1 && url.search('/public') === 0){
      // public resources
      var ext = req.url.split('.')[1];
      respondWithFile(req.url, ext, res);
  } else if ( url.indexOf("&") > -1 ){
    var theme = url.split('/')[1];
    respondWithFile('/public/'+theme+'Chat.html','html',res);

  } else if( ( url.indexOf("?username") > -1 ) && ( url.indexOf("&") === -1 ) ){
    var theme = url.split('/')[1];
    respondWithFile('/public/'+theme+'Chat.html','html',res);

  } else {
    // 404
    respondWithFile('/public/404.html', 'html', res);

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
