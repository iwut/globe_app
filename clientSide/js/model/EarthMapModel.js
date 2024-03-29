// EarthMapModel object constructor
var EarthMapModel = function (user, updatefunc) {

	var sendMapObjectUpdate = updatefunc;
	var userObject = user;

	var scrapData = user.extra;

	//sendToDbTest();

	var mapObject = userObject.pinobject;

	//var homePosition = mapObject.homeposition;
	var visits = mapObject.visits;
	var distances = mapObject.distances;
	//var totalDistance = mapObject.totalDistance;

    var travelPaths = mapObject.travelPaths;

    var currentTravelPath = travelPaths[0];

    //if (travelPaths.length === 0) {
      //  currentTravelPath = null;
    //} else {
    //    currentTravelPath = travelPaths[travelPaths.length - 1].visits;

    //}

	var objects = [];
	var homeMaterial;
	var pinMaterial;
	this.EARTH_RADIUS = 0.5;

	var tmpObject;
	var tmpObjectIndex;

	var oldPin = null;

    this.getCurrentPath = function() {
        return currentTravelPath;
    }

    this.setCurrentPath = function(path) {
        currentTravelPath = path;
        notifyObservers("currentPathUpdateByAddNew");
    }

    this.setCurrentPathByIndex = function(index) {
    	currentTravelPath = travelPaths[index];
    	notifyObservers("currentPathUpdateByIndex");
    }

    this.addToCurrentPath = function(placeName, visit) {
        var coords = {x: visit.x, y: visit.y, z: visit.z};
        currentTravelPath.visits.push({
            name: placeName,
            visit: coords
        });
        //visits.push(visit);
        notifyObservers("addVisit");
    }

    this.removeFromCurrentPath = function(position) {
        if ( ~position ) {
            tmpObject = currentTravelPath.visits.splice(position, 1);
            tmpObjectIndex = position;
        }
        var tmp = distances.splice(position-1, 1);
        mapObject.totalDistance = mapObject.totalDistance - tmp;

        notifyObservers("removeVisit");

    }

    this.getTravelPaths = function() {
        return travelPaths;
    }

    this.addTravelPath = function(path) {
       // var coords = {x: visit.x, y: visit.y, z: visit.z};
        travelPaths.push(path);
        //visits.push(visit);
        notifyObservers("addPath");
    }

	this.setOldPin = function(pin) {
		oldPin = pin;
	}

	this.getOldPin = function() {
		return oldPin;
	}

	this.getScrapData = function() {
		return scrapData;
	}

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

	this.getObjects = function() {
		return objects;
	}






	/******************************
		Observers handling
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


