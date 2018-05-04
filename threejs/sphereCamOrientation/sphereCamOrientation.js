window.onload = function () {
	// Ref: https://github.com/josdirksen/threejs-cookbook/blob/master/03-camera/03.08-rotate-camera-around-scene-y-axis.html

	// Set the scene size.
	const WIDTH = window.innerWidth;
	const HEIGHT = window.innerHeight;
	// Set some camera attributes.
	const VIEW_ANGLE = 45;
	const ASPECT = WIDTH / HEIGHT;
	const NEAR = 0.1;
	const FAR = 10000;

	// Create a WebGL renderer, camera and a scene
	const renderer = new THREE.WebGLRenderer();
	const camera =
		new THREE.PerspectiveCamera(
			VIEW_ANGLE,
			ASPECT,
			NEAR,
			FAR
		);

	const scene = new THREE.Scene();

	// Add the camera to the scene.
	scene.add(camera);

	// Start the renderer.
	renderer.setSize(WIDTH, HEIGHT);
	
	// Attach the renderer-supplied DOM element.
	document.body.appendChild(renderer.domElement);

	// create the sphere's material
	// const sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xCC0000 });
	const sphereMaterial = new THREE.MeshPhongMaterial( 
		{ 
			// color: 0xCC0000, 
			emissive: 0xFF0000
		});
	

	// Set up the sphere vars
	const RADIUS = 20;
	const SEGMENTS = 32;
	const RINGS = 32;

	// Create a new mesh with
	// sphere geometry - we will cover
	// the sphereMaterial next!
	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry(
			RADIUS,
			SEGMENTS,
			RINGS),
		sphereMaterial);

	// Move the Sphere back in Z so we
	// can see it.
	sphere.position.z = 1;

	// Finally, add the sphere to the scene.
	scene.add(sphere);

	/*
	// create a point light
	const pointLight = new THREE.PointLight(0xFFFFFF);
	// set its position
	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;
	// add to the scene
	scene.add(pointLight);
	*/

	
	var spotLightLeft = new THREE.SpotLight(0x00FF00);
	spotLightLeft.position.set(100, 0, 0);
	spotLightLeft.castShadow = true;
	scene.add(spotLightLeft);

	var spotLightHelper = new THREE.SpotLightHelper( spotLightLeft );
	scene.add( spotLightHelper );

	var spotLightRight = new THREE.SpotLight(0x0000FF);
	spotLightRight.position.set(-100, 0, 0);
	spotLightRight.castShadow = true;
	scene.add(spotLightRight);

	var spotLightHelper2 = new THREE.SpotLightHelper( spotLightRight );
	scene.add( spotLightHelper2 );

	var radius = 100, constant = 2, elapsedTime = 0;

	// Setup the animation loop.
	function animate(time) {
		// Draw!
		renderer.render(scene, camera);

		elapsedTime += 0.01;
		// Revolving the camera around the object
		camera.position.x = sphere.position.x + radius * Math.cos( constant * elapsedTime );
		camera.position.z = sphere.position.z + radius * Math.sin( constant * elapsedTime );
		camera.lookAt( sphere.position );		

		// Schedule the next frame.
		requestAnimationFrame(animate);

		TWEEN.update(time);
	}

	// Schedule the first frame.
	requestAnimationFrame(animate);

	// TWEEN

	// h — hue value between 0.0 and 1.0 
	// s — saturation value between 0.0 and 1.0 
	// l — lightness value between 0.0 and 1.0
	// var h = rmapped * 0.01 % 1;
	var s = 0.5;
	var l = 0.5;

	var hue = { hMin: 0}; // Start at (0, 0)
	var tween = new TWEEN.Tween(hue) // Create a new tween that modifies 'hue'.
	.to({ hMin: 1 }, 1000) // Move to (300, 200) in 1 second.
	.easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
	.onUpdate(function() { // Called after tween.js updates 'hue'.
	// Move 'box' to the position described by 'hue' with a CSS translation.
	spotLightLeft.color.setHSL ( hue.hMin, s, l );
	})
	.repeat(Infinity)
	.start(); // Start the tween immediately.
};