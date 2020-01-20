window.onload = function () {
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 1000;
	// camera helper -  reference line
	var helper = new THREE.CameraHelper( camera );
	scene.add( helper )
	// https://riptutorial.com/three-js/example/26556/orbit-controls
	var controls = new THREE.OrbitControls( camera );
	controls.update();

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// 3d Box
	// w(x), h(y), d(z), segmentedFaces(x),segmentedFaces(x),segmentedFaces(x)
	var geometry = new THREE.BoxGeometry(700, 700, 700, 1, 1, 1); 
	var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
	var cube = new THREE.Mesh(geometry, material);
	cube.position.x = -500;
	scene.add(cube);

	// Seconde geometry with material and added to the scene as well.
	// var mysphere = new THREE.SphereGeometry(5, 32, 32);	
	// var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00} );
	// var sphere = new THREE.Mesh(mysphere, sphereMaterial);
	// sphere.position.y = 10;
	// scene.add( sphere );

	var geo = new THREE.BoxGeometry(700, 700, 700, 1, 1, 1); 
	var mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
	var cube2 = new THREE.Mesh(geo, mat);
	cube2.position.x = 500;
	scene.add(cube2);

	// Animation
	function render() {
		requestAnimationFrame(render);
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;

		cube2.rotation.x += 0.01;
		cube2.rotation.y += 0.01;
		renderer.render(scene, camera);

		controls.update();
	};
	render();
};