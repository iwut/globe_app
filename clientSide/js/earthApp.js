$(function() {

	var model = new EarthMapModel();

	var travelLogView = new TravelLogView($('document'), model);
	var travelLogController = new TravelLogController(travelLogView, model);
})