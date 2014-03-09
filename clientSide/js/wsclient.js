var socket;

function callWebSocket(onConnectionFunc) {

	socket = new WebSocket("ws://localhost:3004");

    socket.onopen = onConnectionFunc();
	
	socket.onmessage = function (e) {
		//alert("The message received is : " + e.data);
	};
            
    socket.onerror = function (e) {
    	//alert("An error occured while connecting... " + e.data);
    };

    socket.onclose = function () {
    	//alert("hello.. The connection has been closed");
    };
}


function sendMessage(message){
    // Wait until the state of the socket is not ready and send the message when it is...
    waitForSocketConnection(function(){
        socket.send(message);
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

        }, 5); // wait 5 milisecond for the connection...
}


function sendJSON(object){
	socket.send(JSON.stringify(object));
}