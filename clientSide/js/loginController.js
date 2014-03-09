app.controller("loginController", function($scope){

    $scope.loginfunction = function(){
    	if(!angular.isUndefined($scope.username)&&!angular.isUndefined($scope.password)){
    		callWebSocket(function(){
    			sendMessage("login, usr:"+$scope.username + ", pw:"+$scope.password);
    		});
    		
    	}
    }
});