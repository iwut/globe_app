var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//var geometry = new THREE.CubeGeometry(1,1,1);
//var material = new THREE.MeshPhongMaterial( { ambient: 0xffffff, color: 'red', specular: 0xffffff, shininess: 30, shading: THREE.FlatShading } );
//var cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

var geometry = new THREE.SphereGeometry(0.5, 32, 32);
var material = new THREE.MeshPhongMaterial( { 
	map: THREE.ImageUtils.loadTexture('images/earthmap1k.jpg'),
	bumpMap : THREE.ImageUtils.loadTexture('images/earthbump1k.jpg'),
	bumpScale : 0.05,
	specularMap : THREE.ImageUtils.loadTexture('images/earthspec1k.jpg'),
	specular : new THREE.Color('grey')
 } );
var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 5;

//var light = new THREE.AmbientLight(0x404040);
//scene.add(light);

var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 1, 1 ).normalize();
scene.add(light);

function render(){
	requestAnimationFrame(render);

	sphere.rotation.y += 0.01;
	sphere.rotation.x += 0.001

	renderer.render(scene, camera);
}
render();