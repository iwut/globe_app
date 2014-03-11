var TravelLogView = function(container, model) {

	model.addObserver(this);

	var width = window.innerWidth;
	var height = window.innerHeight;

	var VIEW_ANGLE = 45;
	var ASPECT_RATIO = width/height;
	var NEAR = 0.1;
	var FAR = 10000;


	var projector;
	var mesh;
	var controls;

	var clock = new THREE.Clock();

	var map;
	var earth;
	var EARTH_RADIUS = model.EARTH_RADIUS;

	// Initiate values
	var homePosition = model.getHomePosition();
	var visits = model.getVisits();
	var distances = model.getDistances();
	var totalDistance = model.getTotalDistance();

	//var convertDistance = 8210.92553467;
	var convertDistance = 12732.954;

	var pinMaterial;
	var homeMaterial;

	var camera;


	var scene;
	var renderer;
	var projector;
	var controls;

	this.canvas = container.find('#canvas');
	this.info = container.find("#info");


	init();
	animate();



	this.update = function(arg){
		if (arg == "addToScene") {
			addToScene();
		} else if (arg == "totalDistanceUpdate") {
			updateInfo();
		}
	}

	function updateInfo() {
		$('#totalDistance').text('Total distance traveled: ' + Math.round(100* model.getTotalDistance() * convertDistance)/100 + ' km.');
	}

	function addToScene() {
		var object = model.getLastAddedObject();
		scene.add(object);
		visits = model.getVisits();
		distances = model.getDistances();
		totalDistance = model.getTotalDistance();

			var tmp = $('#visits');
			tmp.find('option').remove()
		for (var i = 0;i < visits.length; i++) {
			tmp.append('<option value=1>Visit</option>')
		};

		//$("#visits").append('<option value=1>Visit 1</option>');
	}

	function init() {
		// Initiation
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR, FAR);
		renderer = new THREE.WebGLRenderer();
		controls = new THREE.OrbitControls(camera);
		controls.addEventListener( 'change', render );

		updateInfo();
		
		projector = new THREE.Projector();

		var light = new THREE.AmbientLight(0xffffff);

		// Configurigation
		light.position.set(-5, -5, 10).normalize;
		scene.add(light);

		// Add old visits
		for (var i = 0; i < visits.length; i++) {
			var pin = visits[i];
			scene.add(pin);
		};

		camera.position.z = 2;

		//var PI2 = Math.PI * 2;
		pinMaterial = new THREE.SpriteMaterial( {
			color: 'red'
		} );

		homeMaterial = new THREE.SpriteMaterial( {
			color: 0x9933FF
		} );

		//map = createMap(40, 40);
		earth = createEarth();

		// Configure renderer
		renderer.setSize(width, height);
		renderer.setClearColor('black', 1);
		this.canvas.appendChild( renderer.domElement );

		render();

		//this.canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
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

		var earth = new THREE.Mesh(sphere, texture);

		scene.add(earth);


		return earth;
	}

	function animate() {
		var delta = clock.getDelta();

		controls.update();
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


	this.getCamera = function() {
		return camera;
	}

	this.getProjector = function() {
		return projector;
	}

	this.getEarth = function() {
		return earth;
	}



}