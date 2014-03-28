var TravelLogController = function(view, model) {

var pinMaterial = new THREE.SpriteMaterial( {
	color: 'red'
} );

var homeMaterial = new THREE.SpriteMaterial( {
	color: 0x9933FF
} );


var posX;
var posY;

$('#canvas').mousedown(function(event) {
	posX = ( event.clientX / window.innerWidth ) * 2 - 1;
	posY = - ( event.clientY / window.innerHeight ) * 2 + 1;
}).mouseup(function(event) {

	var posX2 = ( event.clientX / window.innerWidth ) * 2 - 1;
	var posY2 = - ( event.clientY / window.innerHeight ) * 2 + 1;

	if (posX === posX2 && posY === posY2) {
		onMouseDown(event);
	}
});




$("select").mouseover(function(){
	view.disableControls();
});

$("#paths").change(function(){
	var index = $('#paths')[0].selectedIndex;
	model.setCurrentPathByIndex(index);
});

$("select").mouseout(function() {
	view.enableControls();
})

	$('#delete').click(function () {
		var index = $('#visits')[0].selectedIndex;
		if (index == 0) {
			alert("Cannot delete hometown");
			return;
		}
		$('#visits :selected').remove(); 
		model.removeVisit(index);
		//model.removeDistance(index);
		model.sendToDb();
	});

    $('#addPath').click(function () {
        var pathName = prompt("Enter name of new path");
        var color = Math.random() * 0xffffff;
        var path = {name: pathName, color: color, visits: []};
        model.addTravelPath(path);
        model.setCurrentPath(path);
    });


	$('#colorPicker').click(function () {
		var val = $('#colorPicker').val()+'';
		alert(val);
		
		model.sendToDb();
	});




function onMouseDown(event) {
	//$('#dialog').dialog('open');
	//alert($(location.search).attr('href'));
	
	//var x = prompt('Enter name of place')
    var currentObj = model.getCurrentPath();
    var currentPath = currentObj.visits;
    var color = currentObj.color;
    var oldPin;

    if (currentPath.length == 0) {
        oldPin = null;
    } else {
        oldPin = currentPath[currentPath.length - 1].visit;
    }

	var camera = view.getCamera();
	var projector = view.getProjector();
	var earth = view.getEarth();

	var objects = model.getObjects();
	var totalDistance = model.getTotalDistance();

	var vector = new THREE.Vector3(posX, posY, 0.5 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize());

	var intersects = raycaster.intersectObject( earth );

	if ( intersects.length > 0 ) {
		var placeName = prompt("Enter name of the place you have visited");
		if (placeName == null) {
			return;
		}
		var intersect = intersects[0];

		var pinSize = .001;

        var material = new THREE.SpriteMaterial( {
            color: color
        } );

        if (oldPin != null) {
            var distance = calculateGreatCircleDistance(oldPin, intersect.point);
            totalDistance += distance;
            model.setTotalDistance(totalDistance);

            model.addDistance(distance);
        }

		var pin = new THREE.Sprite(material);

        if (oldPin != null) {
            drawLine(oldPin, intersect.point, color);
        }

		pin.position = intersect.point;

		//model.setOldPin(pin);

		model.addToCurrentPath(placeName, intersect.point);

			//visitsPositions.push(pin.position);
		pin.scale.x = pin.scale.y = pin.scale.z = 10*pinSize;
		model.addToScene( pin );

		model.sendToDb();
		}
	}

    function drawLine(oldCoord, newPinVector, color) {

        var geometry = new THREE.Geometry();


        for (var scalar = 0.001; scalar < 1; scalar += 0.001) {
           // var oldVector = new THREE.Vector3(oldPin.position.x, oldPin.position.y, oldPin.position.z);
            var oldVector = new THREE.Vector3(oldCoord.x, oldCoord.y, oldCoord.z);
            var newVector = new THREE.Vector3(newPinVector.x, newPinVector.y, newPinVector.z);

            var intersectVector = newVector.sub(oldVector);
            intersectVector.multiplyScalar(scalar);
            intersectVector = oldVector.add(intersectVector).normalize().multiplyScalar(1.001*model.EARTH_RADIUS);

          //  pin.position = intersectVector;
           // pin.scale.x = pin.scale.y = pin.scale.z = 10*pinSize;
           // model.addToScene( pin );

            geometry.vertices.push(intersectVector);
        }

        var lineMaterial = new THREE.LineBasicMaterial({color: color});
        var line = new THREE.Line(geometry, lineMaterial, THREE.LineStrip);
        model.addToScene(line);

    }

	function calculateGreatCircleDistance(first, second) {
		var EARTH_RADIUS = model.EARTH_RADIUS;
		var deltaX = first.x - second.x;
		var deltaY = first.y - second.y;
		var deltaZ = first.z - second.z;
		var xSquared = deltaX * deltaX;
		var ySquared = deltaY * deltaY;
		var zSquared = deltaZ * deltaZ;

		var w = Math.sqrt(xSquared + ySquared + zSquared);

		var arc = 2*EARTH_RADIUS*Math.asin(w/(2*EARTH_RADIUS));

		return arc;
	}

}