app.controller("loginController", function($scope){

    $scope.trololo = function(){
    	if(!angular.isUndefined($scope.username)&&!angular.isUndefined($scope.password)&&!angular.isUndefined($scope.samePassword)&&!angular.isUndefined($scope.email)&&!angular.isUndefined($scope.phone)){
    		callWebSocket(function(){
    			createUser($scope.username, $scope.password, $scope.email, $scope.phone);
    		}, function (e){
    			var exists = JSON.parse(e.data).exists;
        		if(!exists){
        			alert('User Created!');
            		window.location = "./login.html";
        		}else{
            		alert('User already exists!');
        		}
    		});
    	}
    }
});