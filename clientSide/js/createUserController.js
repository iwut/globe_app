app.controller("loginController", function($scope){

    $scope.trololo = function(){
    	if(!angular.isUndefined($scope.username)&&!angular.isUndefined($scope.password)&&!angular.isUndefined($scope.samePassword)&&!angular.isUndefined($scope.email)&&!angular.isUndefined($scope.phone)){
    		alert("ej implementerad");
    	}
    }
});