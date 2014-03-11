var width = window.innerWidth;
var height = window.innerHeight;

var VIEW_ANGLE = 45;
var ASPECT_RATIO = width/height;
var NEAR = 0.1;
var FAR = 10000;

var camera;
var scene;
var renderer;

var projector;
var mesh;
var controls;

var clock = new THREE.Clock();

var objects = new Array();
var container;

var earth;
var EARTH_RADIUS = 0.5;

var pinMaterial;

var homeVector = null;

var visitsPositions = [];

var visitsDistances = [];
var totalDistance;

var convertDistance = 8210.92553467;



init();
animate();

function init() {
	container = document.getElementById('canvas');

	totalDistance = 0;
	info = document.getElementById('info');
	info.innerHTML = 'Total distance traveled: ' + totalDistance;

	// Initiation
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR, FAR);
	renderer = new THREE.WebGLRenderer();
	controls = new THREE.FlyControls(camera);
	projector = new THREE.Projector();

	//var light = new THREE.DirectionalLight(0xffffff);
	//var light = new THREE.PointLight( 0xffffff, 1, 100 );
	var light = new THREE.AmbientLight(0xffffff);

	// Configurigation
	light.position.set(-5, -5, 10).normalize;
	scene.add(light);

	controls.movementSpeed = 1;
	controls.domElement = container;
	controls.rollSpeed = 0.5;
	controls.dragToLook = true;
	controls.autoForward = false;

	camera.position.z = 2;



	//var PI2 = Math.PI * 2;
	pinMaterial = new THREE.SpriteMaterial( {
		color: 'red'
	} );

	homeMaterial = new THREE.SpriteMaterial( {
		color: 0x9933FF
	} );

	earth = createEarth();

	clicks = 0;




	// Configure renderer
	renderer.setSize(width, height);
	renderer.setClearColor('black', 1);
	container.appendChild( renderer.domElement );

	render();

	container.addEventListener( 'mousedown', onDocumentMouseDown, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

function createEarth() {

	var sphere = new THREE.SphereGeometry(EARTH_RADIUS, 120, 120);
	var texture = new THREE.MeshPhongMaterial( { 
		map: THREE.ImageUtils.loadTexture('../resources/earthmap1k.jpg'),
		bumpMap : THREE.ImageUtils.loadTexture('../resources/earthbump1k.jpg'),
		bumpScale : 0.05,
		specularMap : THREE.ImageUtils.loadTexture('../resources/earthspec1k.jpg'),
		specular : new THREE.Color('grey')
	} );

	//var texture = new THREE.MeshNormalMaterial();

	var earth = new THREE.Mesh(sphere, texture);
	//earth.position.z = -2;
	scene.add(earth);

	objects.push(earth);

	return earth;
}

function calculateGreatCircleDistance(first, second) {
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

function animate() {
	var delta = clock.getDelta();

	//earth.rotation.y += 0.001;
	//earth.rotation.x += 0.001

	controls.update(delta);
	render();
	requestAnimationFrame(animate);
}

function render() {
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseDown(event) {

	event.preventDefault();

	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var test = objects;
	var intersects = raycaster.intersectObjects( objects );

	if ( intersects.length > 0 ) {
		var intersect = intersects[0];

		var pinSize = .001;

		var material;
		if (homeVector == null) {
			homeVector = intersect.point;
			material = homeMaterial;

		} else {
			material = pinMaterial;
			var distance = calculateGreatCircleDistance(homeVector, intersect.point);
			totalDistance += distance;
			info.innerHTML = 'Total distance traveled: ' + totalDistance;
			visitsDistances.push(distance);

		}
			

		var pin = new THREE.Sprite(material);

		pin.position = intersect.point;
		visitsPositions.push(pin);
		pin.scale.x = pin.scale.y = 10*pinSize;
		scene.add( pin );
	}
}




