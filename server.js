var
http = require('http'),
path = require('path'),
fs = require('fs');
 
server = http.createServer(requestHandler);
server.listen(3000);

console.log('Server listening on port ' + server.address().port);

function requestHandler(req, res) {
    var localFolder = __dirname + '/clientSide/';
    var page404 = localFolder + '404.html';

    if(!path.basename(req.url)){
    	finalPath = path.join(localFolder, 'index.html');
    }else{
		finalPath = path.join(localFolder, req.url);    	
    }
    console.log(req.socket.remoteAddress + ':' + req.url);
    getFile((finalPath),res,page404);
};


function getFile(filePath,res,page404){
    fs.exists(filePath,function(exists){
        if(exists){
            fs.readFile(filePath,function(err,contents){
                if(!err){
                    res.end(contents);
                } else {
                    console.dir(err);
                };
            });
        } else {
            fs.readFile(page404,function(err,contents){
                if(!err){
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(contents);
                } else {
                    console.dir(err);
                };
            });
        };
    });
};