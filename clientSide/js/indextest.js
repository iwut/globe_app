
var updateinterval = 1*10*1000;
var userobject;
var sessionid = 1;


callWebSocket(
    function(){
        getMapObj(sessionid);
        setInterval(
            function(){
                sendMapObjUpdate(userobject);
                //alert('update: ' + JSON.stringify(userobject));
                
            },
            updateinterval);
        //sendLogin($scope.username, $scope.password);
    }, function (e){
        alert('troll');
        userobject = JSON.parse(e.data);
        alert('begin: ' + JSON.stringify(userobject));
        //var sessionid = JSON.parse(e.data).sessionid;
        //if(sessionid>(-1)){
            //window.location = "./index.html?sessionid="+sessionid;
            //window.location = "./indextest.html?sessionid="+sessionid;
        //}else{
            //alert('Login Failed!\nTry another login.\nSessionid was: '+sessionid);
        //}
    });