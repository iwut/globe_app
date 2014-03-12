$(function() {


	var href = window.location.href;
	var url = $.url(href);

	var sessionid = url.param('sessionid');

	var userObject;
	var model;
	var travelLogView;
	var travelLogController;


	var updateinterval = 1*10*1000;
	var userObject;

	callWebSocket(
    function(){
        getMapObj(sessionid);
      
    }, function (e){

        userObject = JSON.parse(e.data);
      //  alert('begin: ' + JSON.stringify(userObject));

    model = new EarthMapModel(userObject, sendMapObjUpdate);

	travelLogView = new TravelLogView($('document'), model);
	travelLogController = new TravelLogController(travelLogView, model);
    });
})



