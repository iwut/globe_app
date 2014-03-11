var TravelLogController = function(view, model) {

var pinMaterial = new THREE.SpriteMaterial( {
	color: 'red'
} );

var homeMaterial = new THREE.SpriteMaterial( {
	color: 0x9933FF
} );


var posX;
var posY;

// $('#info').click(function(e) {
//    e.stopPropagation(); // STOP
// });



$('#canvas').mousedown(function(event) {
	// if ($(event.target).is('select')) {
	// 	event.preventDefault();
	// 	return;
	// }
	posX = ( event.clientX / window.innerWidth ) * 2 - 1;
	posY = - ( event.clientY / window.innerHeight ) * 2 + 1;
}).mouseup(function(event) {

	var posX2 = ( event.clientX / window.innerWidth ) * 2 - 1;
	var posY2 = - ( event.clientY / window.innerHeight ) * 2 + 1;

	if (posX === posX2 && posY === posY2) {
		onMouseDown(event);
	}
});

$("#visits").click(function(){
    var size = $('#visits option').size();
    if(size!=$("#visits").prop('size'))
       {
       $("#visits").prop('size',size);
}
    else
    {
        $("#visits").prop('size',1);
    }

});

function onMouseDown(event) {

	var hej = view.canvas;
	var hoj = view.infoBox;

	var camera = view.getCamera();
	var projector = view.getProjector();
	var earth = view.getEarth();

	var objects = model.getObjects();
	var totalDistance = model.getTotalDistance();

	var vector = new THREE.Vector3(posX, posY, 0.5 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = raycaster.intersectObject( earth );

	if ( intersects.length > 0 ) {
		var intersect = intersects[0];

		var pinSize = .001;

		var material;
		if (model.getHomePosition() == null) {
			//	homeVector = intersect.point;
			model.setHomePosition(intersect.point);
				material = homeMaterial;// model.getHomeMaterial();

			} else {
				material = pinMaterial;// model.getPinMaterial();
				var distance = calculateGreatCircleDistance(model.getHomePosition(), intersect.point);
				totalDistance += distance;
				model.setTotalDistance(totalDistance);
				//info.innerHTML = 'Total distance traveled: ' + totalDistance;
			//	visitsDistances.push(distance);
			model.addDistance(distance);

		}

		var pin = new THREE.Sprite(material);

		pin.position = intersect.point;
		model.addVisit(pin);
			//visitsPositions.push(pin.position);
			pin.scale.x = pin.scale.y = 10*pinSize;
			model.addToScene( pin );
		}
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