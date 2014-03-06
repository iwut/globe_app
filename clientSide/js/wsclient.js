var socket;

function callWebSocket() {

	socket = new WebSocket("ws://localhost:3004");

    socket.onopen = function () {
    	alert("Hello, Connected To WS server");
    	$( "#btn" ).attr('disabled', false);
    };
	
	socket.onmessage = function (e) {
		alert("The message received is : " + e.data);
	};
            
    socket.onerror = function (e) {
    	alert("An error occured while connecting... " + e.data);
    };

    socket.onclose = function () {
    	alert("hello.. The connection has been closed");
    };
}

function sendMessage(){
	if('null' != socket){
		if(socket.readyState == 1){
			socket.send($("#msg").val());
		}
		else{
			console.log('Socket has been closed! :(');
		}	
	}
	else{
		console.log('Socket has not been connected. Please connect!');
	}
	
}