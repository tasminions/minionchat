var fs = require('fs');


function router(req, res){
  var url = req.url;
  if(url === "/"){
    fs.readFile(__dirname + "/../public/index.html", function(err, content){
      if(err){
        res.writeHead(500, {"Content-type": "text/html"});
        console.log(err);
        res.end(err);
      } else {
        res.writeHead(200, {"Content-type": "text/html"});
        res.end(content.toString('utf8'));
      }
    });
  } else if(url===""){

  }
}


module.exports = router;
