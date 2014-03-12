// EarthMapModel object constructor
var EarthMapModel = function (user, updatefunc) {

	var sendMapObjectUpdate = updatefunc;
	var userObject = user;

	//sendToDbTest();

	var mapObject = userObject.pinobject;

	//var homePosition = mapObject.homeposition;
	var visits = mapObject.visits;
	var distances = mapObject.distances;
	//var totalDistance = mapObject.totalDistance;

	var objects = [];
	var homeMaterial;
	var pinMaterial;
	this.EARTH_RADIUS = 0.5;

	var tmpObject;
	var tmpObjectIndex;

	this.sendToDb = function() {
		sendMapObjectUpdate(userObject);
	}


	this.setUserId = function(id) {
		userId = id;
		notifyObservers("userIdUpdate");
	}

	this.getUserId = function() {
		return userId;
	}


	this.setHomePosition = function(pos) {
		mapObject.homeposition = pos;
		notifyObservers("homePositionUpdate");
	}

	this.getHomePosition = function() {
		return mapObject.homeposition;
	}


	this.setVisits = function(arr) {
		visits = arr;
		notifyObservers("visitsSetUpdate");
	}

	this.getVisits = function() {
		return visits;
	}

	this.addVisit = function(placeName, visit) {
		var coords = {x: visit.x, y: visit.y, z: visit.z};
			visits.push({
				name: placeName,
				visit: coords
			});
		//visits.push(visit);
		notifyObservers("addVisit");
	}

	this.removeVisit = function(position) {
		if ( ~position ) {
			tmpObject = visits.splice(position, 1);
			tmpObjectIndex = position;
		}
		var tmp = distances.splice(position-1, 1);
		mapObject.totalDistance = mapObject.totalDistance - tmp;
		
		notifyObservers("removeVisit");

	}


	this.setDistances = function(arr) {
		distances = arr;
		notifyObservers("distancesUpdate");
	}

	this.getDistances = function() {
		return distances;
	}

	this.addDistance = function(distance) {
		distances.push(distance);
		notifyObservers("addDistance");
	}

	this.setTotalDistance = function(newDistance) {
		mapObject.totalDistance = newDistance;
		notifyObservers("totalDistanceUpdate");
	}

	this.getTotalDistance = function() {
		return mapObject.totalDistance;
	}


	this.addToScene = function(object) {
		//scene.add(object);
		objects.push(object);
		//tmpObject = object;
		notifyObservers('addToScene');
	}

	this.getLastAddedObject = function() {
		var i = objects.length;
		return objects[i-1];
	}



	this.setOjects = function(arr) {
		objects = arr;
		notifyObservers("objectsUpdate");
	}

	this.getObjects = function() {
		return objects;
	}

	this.addToObjects = function(object) {
		objects.push(object);
		notifyObservers("addObject");
	}

	this.getTmpObject = function() {
		return tmpObject;
	}

	this.getTmpObjectIndex = function () {
		return tmpObjectIndex;
	}


	var setHomeMaterial = function(arg) {
		homeMaterial = arg;
		notifyObservers('homeMaterialUpdate');
	}

	var getHomeMaterial = function() {
		return homeMaterial;
	}


	var setPinMaterial = function(arg) {
		pinMaterial = arg;
		notifyObservers('pinMaterialUpdate');
	}

	var getPinMaterial = function() {
		return pinMaterial;
	}

	




	/******************************
		Observables handling
	******************************/



	var observers = [];

	this.addObserver = function(observer) {
		observers.push(observer);
	}

	var notifyObservers = function(arg) {
		for(var i = 0; i < observers.length; i++) {
			observers[i].update(arg);
		}
	}
}


