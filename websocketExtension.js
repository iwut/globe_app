module.exports = {
  
  startWebSocketServer : function(wsport){

    var WebSocketServer = require('ws').Server, 
      wss = new WebSocketServer({port: wsport});
    
    console.log('WS Server listening on port ' + wss.options.port);

    wss.on('connection', function(ws) {
      
      ws.on('message', function(message) {
        console.log('received: %s', message);
      });
      ws.send('hello from server');

    });



  }
}