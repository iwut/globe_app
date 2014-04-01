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

    var travelPaths = model.getTravelPaths();

    var currentPath = model.getCurrentPath();

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

	

	var nodes = $('#visits');
	var paths = $('#paths');

	this.canvas = container.find('#canvas');
	this.info = container.find("#info");


	init()
	animate();

	this.disableControls = function() {
		controls.enabled = false;
	}

	this.enableControls = function() {
		controls.enabled = true;
	}

	this.update = function(arg){
		if (arg == "addToScene") {
			addToScene();
            populateNodesSelect();
		} else if (arg == "removeVisit") {
			clearScene();
            populateNodesSelect();
            addOldVisits();

		} else if (arg == "addPath") {
            populatePaths();
			updatePaths();

		} else if (arg == "currentPathUpdateByIndex") {
			currentPath = model.getCurrentPath();
            populateNodesSelect();

		} else if (arg == "currentPathUpdateByAddNew") {
			$('#paths :nth-child(' + model.getTravelPaths().length + ')').prop('selected', true);
            populateNodesSelect();

        }
        calculateTotalDistanceForCurrentPath();
	}

	function updatePaths() {
		travelPaths = model.getTravelPaths();
	    paths.append('<option value=1>' + travelPaths[travelPaths.length - 1].name + '</option>');


	}

	function clearScene() {
		//var tmp = model.getTmpObjectIndex() + 3;

        var length = scene.children.length;
        for (var i=length; i >= 3; i--){
            var obj = scene.children[i];
            scene.remove(obj);
        }
		updateInfo();
	}

	function updateInfo(totalDistance) {
		$('#totalDistance').text('Travel distance: ' + Math.round(100* totalDistance * convertDistance)/100 + ' km.');
	}

    function calculateTotalDistanceForCurrentPath() {
        currentPath = model.getCurrentPath();

        var visits = currentPath.visits;

        var totalDistance = 0;
        var previous;
        var current;
        for (var i = 1; i < visits.length; i++) {
            current = visits[i].visit;
            previous = visits[i-1].visit;

            totalDistance += calculateGreatCircleDistance(current, previous);

        }

        updateInfo(totalDistance);
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



	function addToScene() {
		var object = model.getLastAddedObject();
		scene.add(object);
	}

    function populateNodesSelect() {
        currentPath = model.getCurrentPath();
        nodes.find('option').remove();
        for (var i = 0;i < currentPath.visits.length; i++) {
            nodes.append('<option value="1">' + currentPath.visits[i].name + '</option>');
        };
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

		pinMaterial = new THREE.SpriteMaterial( {
			color: 'red'
		} );

		homeMaterial = new THREE.SpriteMaterial( {
			color: 0x9933FF
		} );


		
		var light = new THREE.DirectionalLight(0xffffff, 1);


		// Configurigation
		light.position = camera.position;
		light.position.normalize();
		//light.position.set(-5, -5, 10).normalize;
		scene.add(light);

		earth = createEarth();

        populateNodesSelect();
        addOldVisits();
        populatePaths();
        calculateTotalDistanceForCurrentPath();

		var scrapData = model.getScrapData();
		var bgColor = scrapData.backgroundColor;

		camera.position.z = 2;

		//var PI2 = Math.PI * 2;


		//map = createMap(40, 40);
	

		// Configure renderer
		renderer.setSize(width, height);
		renderer.setClearColor(bgColor, 1);
		this.canvas.appendChild( renderer.domElement );

		render();

		//this.canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
		window.addEventListener( 'resize', onWindowResize, false );
	}

    function populatePaths() {
        var travelPath;
        paths.find('option').remove();
        for (var i = 0; i < travelPaths.length; i++) {
            travelPath = travelPaths[i];
            paths.append('<option value=1>' + travelPaths[i].name + '</option>');
        }
    }

    function addOldVisits() {
        var coords;
        var vector;
        var pin;
        var pinSize = .001;
        var travelPath;
        var color;
        var name;
        var visits;
        var material;
        var oldCoord = null;

        for (var i = 0; i < travelPaths.length; i++) {


            travelPath = travelPaths[i];

            name = travelPath.name;
            color = travelPath.color;
            visits = travelPath.visits;

            material = new THREE.SpriteMaterial( {
                color: color
            } );

            for (var j = 0; j < visits.length; j++) {

                coords = visits[j].visit;

                if (j > 0) {
                    drawLine(oldCoord, coords, color);
                }

                vector = new THREE.Vector3(coords.x, coords.y, coords.z );

                pin = new THREE.Sprite(material);

                pin.position = vector;
                pin.scale.x = pin.scale.y = pin.scale.y = 10*pinSize;

                //var pin = visits[i];
                scene.add(pin);

                //nodes.append('<option value=1>' + visits[j].name + '</option>');


                oldCoord = coords;
            }

        };
    }

    function drawLine(oldCoord, coords, color) {

        var geometry = new THREE.Geometry();


        for (var scalar = 0.001; scalar < 1; scalar += 0.001) {
            // var oldVector = new THREE.Vector3(oldPin.position.x, oldPin.position.y, oldPin.position.z);
            var oldVector = new THREE.Vector3(oldCoord.x, oldCoord.y, oldCoord.z);
            var newVector = new THREE.Vector3(coords.x, coords.y, coords.z);

            var intersectVector = newVector.sub(oldVector);
            intersectVector.multiplyScalar(scalar);
            intersectVector = oldVector.add(intersectVector).normalize().multiplyScalar(1.001*model.EARTH_RADIUS);

            geometry.vertices.push(intersectVector);
        }

        var lineMaterial = new THREE.LineBasicMaterial({color: color });
        var line = new THREE.Line(geometry, lineMaterial, THREE.LineStrip);
        scene.add(line);

    }

	function createEarth() {

		var sphere = new THREE.SphereGeometry(EARTH_RADIUS, 120, 120);
		var texture = new THREE.MeshPhongMaterial( { 
			map: THREE.ImageUtils.loadTexture('../resources/earthmap1k.jpg'),
			bumpMap : THREE.ImageUtils.loadTexture('../resources/earthbump1k.jpg'),
			bumpScale : 0.05,
			specularMap : THREE.ImageUtils.loadTexture('../resources/earthspec1k.jpg'),
			specular : new THREE.Color('grey'),
			shininess: 8
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
