$(function() {


	var href = window.location.href;
	var url = $.url(href);
	

	//var sessionid = url.param('sessionid');


	//var search = $(location).attr('href');
	//var href = window.location.href;
	//var url = $.url(href);
	

	var sessionid = url.param('sessionid');
//	var sessionid = 1;

	//$.url('http://allmarkedup.com?sky=blue&grass=green').param('sky'); // returns 'blue'


	//var search = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);

	//alert(window.location.href.search);
	//alert(sessionid);

	var userObject;
	var model;
	var travelLogView;
	var travelLogController;


	var updateinterval = 1*10*1000;
	var userObject;

	callWebSocket(
    function(){
        getMapObj(sessionid);
        setInterval(
            function(){
                sendMapObjUpdate(userObject);
                //alert('update: ' + JSON.stringify(userobject));
                
            },
            updateinterval);
        //sendLogin($scope.username, $scope.password);
    }, function (e){
       // alert('troll');
        userObject = JSON.parse(e.data);
        alert('begin: ' + JSON.stringify(userObject));
        //var sessionid = JSON.parse(e.data).sessionid;
        //if(sessionid>(-1)){
            //window.location = "./index.html?sessionid="+sessionid;
            //window.location = "./indextest.html?sessionid="+sessionid;
        //}else{
            //alert('Login Failed!\nTry another login.\nSessionid was: '+sessionid);
        //}
    model = new EarthMapModel(userObject);

	travelLogView = new TravelLogView($('document'), model);
	travelLogController = new TravelLogController(travelLogView, model);
    });
})



