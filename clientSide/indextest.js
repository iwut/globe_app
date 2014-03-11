callWebSocket(
    function(){
    	sendLogin($scope.username, $scope.password);
    }, function (e){
        var sessionid = JSON.parse(e.data).sessionid;
        if(sessionid>(-1)){
            //window.location = "./index.html?sessionid="+sessionid;
            window.location = "./indextest.html?sessionid="+sessionid;
        }else{
            alert('Login Failed!\nTry another login.\nSessionid was: '+sessionid);
        }
	});