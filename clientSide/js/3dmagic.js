

var width = window.innerWidth;
var height = window.innerHeight;

var VIEW_ANGLE = 45;
var ASPECT_RATIO = width/height;
var NEAR = 0.1;
var FAR = 10000;




var camera;
var scene;
var renderer;
var mesh;
var controls;

var clock = new THREE.Clock();

var objectArray = new Array();
var container;

var map;

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

	var light = new THREE.DirectionalLight(0xffffff);

	// Configurigation
	light.position.set(-5, -5, 10).normalize;
	scene.add(light);

	controls.movementSpeed = 100;
	controls.domElement = container;
	controls.rollSpeed = 0.5;
	controls.dragToLook = true;
	controls.autoForward = false;



	map = createMap(40, 40);




	// Configure renderer
	renderer.setSize(width, height);
//	renderer.setClearColor(0xffffff, 1);
	container.appendChild( renderer.domElement );

	render();

	window.addEventListener( 'resize', onWindowResize, false );
}

function createMap(width, height) {
	var plane = new THREE.PlaneGeometry(width, height);
	var material = new THREE.MeshNormalMaterial();

	var mesh = new THREE.Mesh(plane, material);

	mesh.position.z = -100;


	scene.add(mesh);
}

function animate() {
	var delta = clock.getDelta();

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