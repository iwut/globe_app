module.exports = {
  var first = true;  
  startWebSocketServer : function(wsport){

    var WebSocketServer = require('ws').Server, 
      wss = new WebSocketServer({port: wsport});
    
    console.log('WS Server listening on port ' + wss.options.port);

    wss.on('connection', function(ws) {
      
      ws.on('message', function(message) {
        if(first){
          console.log('received: %s', message);
        }else{
          console.log('JSON: ' + JSON.parse(message));
        }
      });
      ws.send('hello from server');

    });



  }
}