module.exports = {
  first : true,

  startWebSocketServer : function(wsport){



handleOnMessage = function(object,ws){
    if(object.type=="login"){
      console.log("User login: " + object.username);
      validateLoginWrapper(object, function(loginObj){
        ws.send(JSON.stringify(loginObj));
      });
    }else if(object.type=="signup"){
      console.log("User signup: " + object.username);
      signupWrapper(object, function(signupResponse){
        ws.send(JSON.stringify(signupResponse));
      });
    }else if(object.type=="setobj"){
      updateWrapper(object, function(){
        console.log('User update, sessid: ' + object.sessionid);
      });
    }else if(object.type=="getobj"){
      getterWrapper(object, function(signupResponse){
        ws.send(JSON.stringify(signupResponse));
        console.log("User load, sessid: " + object.sessionid);
      });
    }else{
      console.log("Received unknown message.");
    }
  };


  updateWrapper = function(object, callback){
    mdb = require('./mongodbtest.js');
    mdb.connectDb(function(){
      mdb.updateMapResources(object, function(){
          callback();
      });
    });
  };
  

  getterWrapper = function(object, callback){
    mdb = require('./mongodbtest.js');
    mdb.connectDb(function(){
      mdb.getMapResources(object, function(item){
          callback(item);
      });
    });
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
        //console.log('y: ' + message);
        var obj = JSON.parse(message);
        //console.log('JSON- type: ' + obj.objtype + ', message: ' + obj.objmess);
        handleOnMessage(obj,ws);
      });
      //ws.send('hello from server');

    });
  },
}