app.controller("loginController", function($scope){

    $scope.loginfunction = function(){
    	if(!angular.isUndefined($scope.username)&&!angular.isUndefined($scope.password)){
    		callWebSocket(function(){
    			sendLogin($scope.username, $scope.password);
    		}, function (e){
        		var sessionid = JSON.parse(e.data).sessionid;
        		if(sessionid>(-1)){
            		window.location = "./index.html&="+sessionid;
        		}else{
            		alert('Login Failed!\nTry another login.\nSessionid was: '+sessionid);
        		}
			});
    	}
    };
    $scope.signup = function(){
    	window.location = "./createUser.html";
    };	
    	
});