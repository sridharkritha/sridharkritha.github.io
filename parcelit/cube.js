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
	scene.add(cube);

	// Animation
	function render() {
		requestAnimationFrame(render);
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		renderer.render(scene, camera);
	};
	render();
};