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

var map;
var earth;

init();
animate();







function init() {
	container = document.getElementById('canvas');
	document.body.appendChild(container);

	// Initiation
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR, FAR);
	renderer = new THREE.WebGLRenderer();
	controls = new THREE.FlyControls(camera);
	projector = new THREE.Projector();

	var light = new THREE.DirectionalLight(0xffffff);

	// Configurigation
	light.position.set(-5, -5, 10).normalize;
	scene.add(light);

	controls.movementSpeed = 1;
	controls.domElement = container;
	controls.rollSpeed = 0.5;
	controls.dragToLook = true;
	controls.autoForward = false;



	var PI2 = Math.PI * 2;
	particleMaterial = new THREE.SpriteCanvasMaterial( {

		color: 0x000000,
		program: function ( context ) {

			context.beginPath();
			context.arc( 0, 0, 0.5, 0, PI2, true );
			context.fill();

		}

	} );


	//map = createMap(40, 40);
	earth = createEarth();




	// Configure renderer
	renderer.setSize(width, height);
	renderer.setClearColor(0xffffff, 1);
	container.appendChild( renderer.domElement );

	render();

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	window.addEventListener( 'resize', onWindowResize, false );
}

function createEarth() {
	var sphere = new THREE.SphereGeometry(0.5, 120, 120);
	// var texture = new THREE.MeshPhongMaterial( { 
	// 	map: THREE.ImageUtils.loadTexture('images/earthmap1k.jpg'),
	// 	bumpMap : THREE.ImageUtils.loadTexture('images/earthbump1k.jpg'),
	// 	bumpScale : 0.05,
	// 	specularMap : THREE.ImageUtils.loadTexture('images/earthspec1k.jpg'),
	// 	specular : new THREE.Color('grey')
	// } );

	var texture = new THREE.MeshNormalMaterial();

	var earth = new THREE.Mesh(sphere, texture);
	earth.position.z = -2;
	scene.add(earth);

	objects.push(earth);

	return earth;
}



function createMap(width, height) {
	var plane = new THREE.PlaneGeometry(width, height);
	var material = new THREE.MeshNormalMaterial();

	var mesh = new THREE.Mesh(plane, material);

	mesh.position.z = -100;

	objects.push(mesh);

	scene.add(mesh);

	return mesh;
}

function animate() {
	var delta = clock.getDelta();

	earth.rotation.y += 0.001;
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

	var tmp = map;
	var intersects = raycaster.intersectObjects( objects, true );

	if ( intersects.length > 0 ) {
		var intersect = intersects[0];
		var intersectPoint = intersect.point;

		

		var material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 'red', specular: 0x555555, shininess: 30 } ); 
		
		var particle = new THREE.Mesh(new THREE.SphereGeometry(.001, 10, 10), material);
		particle.position = intersectPoint;
		particle.scale.x = particle.scale.y = 16;
		scene.add( particle );

	}

}