window.onload = function () {
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

	// Create a new mesh with sphere geometry
	const sphere = new THREE.Mesh(
		new THREE.SphereGeometry(
			RADIUS,
			SEGMENTS,
			RINGS),
		sphereMaterial);

	// Move the Sphere back in Z so we can see it.
	sphere.position.z = 1;

	// Finally, add the sphere to the scene.
	scene.add(sphere);

	// create a spot light
	var spotLightLeft = new THREE.SpotLight(0x00FF00);
	spotLightLeft.position.set(100, 0, 0);
	spotLightLeft.castShadow = true;
	scene.add(spotLightLeft);

	// var spotLightHelper = new THREE.SpotLightHelper( spotLightLeft );
	// scene.add( spotLightHelper );

	var spotLightRight = new THREE.SpotLight(0x0000FF);
	spotLightRight.position.set(-100, 0, 0);
	spotLightRight.castShadow = true;
	scene.add(spotLightRight);

	// var spotLightHelper2 = new THREE.SpotLightHelper( spotLightRight );
	// scene.add( spotLightHelper2 );

	var radius = 100, constant = 1, elapsedTime = 0, rmapped = 0, antiClockwise = false;

	// Setup the animation loop.
	function animate(time) {
		// Draw!
		renderer.render(scene, camera);
		
		if(antiClockwise)
		{
			elapsedTime -= 0.1;
			if(elapsedTime < 0)
			{
				antiClockwise = false;
			}
		}
		else
		{
			elapsedTime += 0.1;
			if(elapsedTime > 45)
			{
				antiClockwise = true;
			}
		}
		
		// Revolving the camera around the object
		camera.position.x = sphere.position.x + radius * Math.cos( constant * elapsedTime );
		camera.position.z = sphere.position.z + radius * Math.sin( constant * elapsedTime );
		camera.lookAt( sphere.position );

		// Schedule the next frame.
		requestAnimationFrame(animate);

		var h = rmapped * 0.01 % 1;
		var s = 0.5;
		var l = 0.5;
		spotLightLeft.color.setHSL ( h, s, l );
		spotLightRight.color.setHSL ( h, s+0.7, l- 0.3 );
		rmapped ++;
	}

	// Schedule the first frame.
	requestAnimationFrame(animate);
};