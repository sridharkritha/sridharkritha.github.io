window.onload = function () {
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 1000;
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// 3d Box
	// w(x), h(y), d(z), segmentedFaces(x),segmentedFaces(x),segmentedFaces(x)
	var geometry = new THREE.BoxGeometry(700, 700, 700, 1, 1, 1); 
	var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
	var cube = new THREE.Mesh(geometry, material);
	//cube.position.y = 30;
	scene.add(cube);

	// Seconde geometry with material and added to the scene as well.
	// var mysphere = new THREE.SphereGeometry(5, 32, 32);	
	// var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00} );
	// var sphere = new THREE.Mesh(mysphere, sphereMaterial);
	// sphere.position.y = 10;
	// scene.add( sphere );

	// Animation
	function render() {
		requestAnimationFrame(render);
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		renderer.render(scene, camera);
	};
	render();
};