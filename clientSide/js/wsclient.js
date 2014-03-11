var socket;

function callWebSocket(onConnectionFunc, onReceive) {

	socket = new WebSocket("ws://localhost:3002");

    socket.onopen = onConnectionFunc;
	
	socket.onmessage = onReceive;
            
    socket.onerror = function (e) {
    	//alert("An error occured while connecting... " + e.data);
    };

    socket.onclose = function (e) {
    	//alert("hello.. The connection has been closed");
    };
}


function sendMessage(type, message){
    // Wait until the state of the socket is not ready and send the message when it is...
    waitForSocketConnection(function(){
        socket.send(JSON.stringify({type: type, objmess: message}));
    });
}

function sendLogin(login, pw){
    waitForSocketConnection(function(){
        //pw = md5(pw);
        socket.send(JSON.stringify({type:'login',username: login, password: pw}));
    });   
}

function createUser(usr, pw, em, no){
    waitForSocketConnection(function(){
        //pw = md5(pw);
        socket.send(JSON.stringify({
            type:'signup',
            username: usr, 
            password: pw,
            email: em,
            telephone: no
        }));
    });  
}

function getMapObj(){
    waitForSocketConnection(function(){
        //pw = md5(pw);
        socket.send(JSON.stringify({type:'signup',username: login, password: pw}));
    });  
}

function sendMapObjUpdate(object){
    waitForSocketConnection(function(){
        //pw = md5(pw);
        socket.send(JSON.stringify({type:'signup',username: login, password: pw}));
    });  
}

// Make the function wait until the connection is made...
function waitForSocketConnection(callback){
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                if(callback != null){
                    callback();
                }
                return;

            } else {
                waitForSocketConnection(socket);
            }

        }, 50); // wait 5 milisecond for the connection...
}


function sendJSON(object){
	socket.send(JSON.stringify(object));
}