// EarthMapModel object constructor
var EarthMapModel = function () {

	var userId;

	var homePosition = null;
	var visits = [];
	var distances = [];
	var totalDistance = 0;

	var objects = [];
	var homeMaterial;
	var pinMaterial;
	this.EARTH_RADIUS = 0.5;



	this.setUserId = function(id) {
		userId = id;
		notifyObservers("userIdUpdate");
	}

	this.getUserId = function() {
		return userId;
	}


	this.setHomePosition = function(pos) {
		homePosition = pos;
		notifyObservers("homePositionUpdate");
	}

	this.getHomePosition = function() {
		return homePosition;
	}


	this.setVisits = function(arr) {
		visits = arr;
		notifyObservers("visitsSetUpdate");
	}

	this.getVisits = function() {
		return visits;
	}

	this.addVisit = function(visit) {
		visits.push(visit);
		notifyObservers("addVisit");
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
		totalDistance = newDistance;
		notifyObservers("totalDistanceUpdate");
	}

	this.getTotalDistance = function() {
		return totalDistance;
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


