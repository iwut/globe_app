module.exports = {
  first : true,

  startWebSocketServer : function(wsport){



handleOnMessage = function(object,ws){
    if(object.type=="login"){
      validateLoginWrapper(object, function(loginObj){
        ws.send(JSON.stringify(loginObj));
      });
    }else if(object.type=="signup"){
      signupWrapper(object, function(signupResponse){
        ws.send(JSON.stringify(signupResponse));
      });
    }else{
      console.log("received redundant message");
    }
  };

  signupWrapper = function(object, callback){
    //signupResponse
    mdb = require('./mongodbtest.js');
    mdb.connectDb(function(){
      mdb.signup(object, function(signupResponse){
          callback(signupResponse);
      });
    });
  };

  validateLoginWrapper = function(object, callback){
    mdb = require('./mongodbtest.js');
    mdb.connectDb(function(){
      mdb.validateLogin(object, function(loginObj){
          callback(loginObj);
      });
    });
  };


    var WebSocketServer = require('ws').Server, 
      wss = new WebSocketServer({port: wsport});
    
    console.log('WS Server listening on port ' + wss.options.port);

    wss.on('connection', function(ws) {
      
      ws.on('message', function(message) {
        console.log('y: ' + message);
        var obj = JSON.parse(message);
        console.log('JSON- type: ' + obj.objtype + ', message: ' + obj.objmess);
        handleOnMessage(obj,ws);
      });
      //ws.send('hello from server');

    });
  },
}