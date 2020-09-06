// NOTE: File access(images) are allowed through web server so run local HTTP server.
// http-server -c-1
// If HTTP server is NOT installed then install by
// npm install -g http-server 
// run the example
// http://127.0.0.1:8080/00_index.html

let app = null;
let bulletYellow = null; // bulletYellow.x = 447; bulletYellow.y = 370;
                         // bulletYellow.x = 530; bulletYellow.y = 370; 
window.addEventListener('load', function () {
	// Global variables	
	init();

	function init() {
		app = new PIXI.Application();

		// canvas to fill the entire window and use css to style them 
		app.renderer.view.style.position = "absolute";
		app.renderer.view.style.display = "block";
		app.renderer.autoResize = true;
		app.renderer.resize(window.innerWidth, window.innerHeight);

		document.body.appendChild(app.view);

		////////// Star war Background  - start //////////////////////////////
		// Get the texture for rope.
		const starTexture = PIXI.Texture.from('./assets/jayAssets/star.png');

		const starAmount = 1000;
		let cameraZ = 0;
		const fov = 20;
		const baseSpeed = 0.025;
		let speed = 0;
		let warpSpeed = 0;
		const starStretch = 5;
		const starBaseSize = 0.05;

		// Create the stars
		const stars = [];
		for (let i = 0; i < starAmount; i++) {
			const star = {
				sprite: new PIXI.Sprite(starTexture),
				z: 0,
				x: 0,
				y: 0,
			};
			star.sprite.anchor.x = 0.5;
			star.sprite.anchor.y = 0.7;
			randomizeStar(star, true);
			app.stage.addChild(star.sprite);
			stars.push(star);
		}

		function randomizeStar(star, initial) {
			star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;

			// Calculate star positions with radial random coordinate so no star hits the camera.
			const deg = Math.random() * Math.PI * 2;
			const distance = Math.random() * 50 + 1;
			star.x = Math.cos(deg) * distance;
			star.y = Math.sin(deg) * distance;
		}

		// Change flight speed every 5 seconds
		setInterval(() => {
			warpSpeed = warpSpeed > 0 ? 0 : 1;
		}, 5000);

		// Listen for animate update
		app.ticker.add((delta) => {
			// Simple easing. This should be changed to proper easing function when used for real.
			speed += (warpSpeed - speed) / 20;
			cameraZ += delta * 10 * (speed + baseSpeed);
			for (let i = 0; i < starAmount; i++) {
				const star = stars[i];
				if (star.z < cameraZ) randomizeStar(star);

				// Map star 3d position to 2d with really simple projection
				const z = star.z - cameraZ;
				star.sprite.x = star.x * (fov / z) * app.renderer.screen.width + app.renderer.screen.width / 2;
				star.sprite.y = star.y * (fov / z) * app.renderer.screen.width + app.renderer.screen.height / 2;

				// Calculate star scale & rotation.
				const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
				const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
				const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
				const distanceScale = Math.max(0, (2000 - z) / 2000);
				star.sprite.scale.x = distanceScale * starBaseSize;
				// Star is looking towards center so that y axis is towards center.
				// Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
				star.sprite.scale.y = distanceScale * starBaseSize + distanceScale * speed * starStretch * distanceCenter / app.renderer.screen.width;
				star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
			}
		});

		/////////////////////////////Star war Background  - end   //////////////////////////////////////
		function keyboard(value) {
			let key = {};
			key.value = value;
			key.isDown = false;
			key.isUp = true;
			key.press = undefined;
			key.release = undefined;
			//The `downHandler`
			key.downHandler = event => {
				if (event.key === key.value) {
					if (key.isUp && key.press) key.press();
					// key.isDown = true;
					// key.isUp = false;
					event.preventDefault();
				}
			};

			//The `upHandler`
			key.upHandler = event => {
				if (event.key === key.value) {
					if (key.isDown && key.release) key.release();
					// key.isDown = false;
					// key.isUp = true;
					event.preventDefault();
				}
			};

			//Attach event listeners
			const downListener = key.downHandler.bind(key);
			const upListener = key.upHandler.bind(key);

			window.addEventListener("keydown", downListener, false);
			window.addEventListener("keyup", upListener, false);

			// Detach event listeners
			key.unsubscribe = () => {
				window.removeEventListener("keydown", downListener);
				window.removeEventListener("keyup", upListener);
			};

			return key;
		}
		////////////////////////////// Keyboard - end ////////////////////////////////////////////////////////////////
		PIXI.loader
			// .add('./assets/jayAssets/fighter.json')
			// .add('./assets/jayAssets/ufo.jpg')
			.add(["./assets/jayAssets/ufo.png", "./assets/jayAssets/fighter.json",
				  "./assets/jayAssets/bulletYellow.png","./assets/jayAssets/bulletGreen.png"])
			// .add(["./assets/ufo.png"])
			.load(onAssetsLoaded);

		function onAssetsLoaded() {
			//////////////////////////////////////// UFO
			let ufo = new PIXI.Sprite(PIXI.Loader.shared.resources["./assets/jayAssets/ufo.png"].texture); // texture NOT textures
			//Change the sprite's position
			ufo.x = 96;
			ufo.y = 96;
			//Change the sprite's size
			ufo.width = 80;
			ufo.height = 120;
			//scale to doubled the size
			ufo.scale.x = 0.5;
			ufo.scale.y = 0.5;
			// Rotation
			// ufo.rotation = 0.5; // Rotate clockwise and the Pivot at (0,0) top left 
			ufo.pivot.set(64 / 2, 64 / 2); // Pivot point moved to (64/2, 64/2)  center of an image of 64x64
			// ufo.rotation = 0.5; // PRotate clockwise and the Pivot at (32,32) center of an image

			// Anything you want to be made visible in the renderer that has to be added to a special Pixi object called the "stage".
			// "stage" is a Pixi Container object. 
			// "stage" object is the root container for all the visible things in your scene. 
			app.stage.addChild(ufo); // Add the ufo to the stage.

			//////////////////////////////////////// Bullet - Yellow
			bulletYellow = new PIXI.Sprite(PIXI.Loader.shared.resources["./assets/jayAssets/bulletYellow.png"].texture); // texture NOT textures
			//Change the sprite's position
			bulletYellow.x = 447;
			bulletYellow.y = 379;
			//Change the sprite's size
			bulletYellow.width = 17; //80;
			bulletYellow.height = 33; //120;
			//scale to doubled the size
			bulletYellow.scale.x = 1; // 0.5;
			bulletYellow.scale.y = 1; // 0.5;
			// Rotation
			// bulletYellow.rotation = 0.5; // Rotate clockwise and the Pivot at (0,0) top left 
			bulletYellow.pivot.set(bulletYellow.width / 2, bulletYellow.height / 2); // Pivot point moved to (64/2, 64/2)  center of an image of 64x64
			// bulletYellow.rotation = 0.5; // PRotate clockwise and the Pivot at (32,32) center of an image

			// Anything you want to be made visible in the renderer that has to be added to a special Pixi object called the "stage".
			// "stage" is a Pixi Container object. 
			// "stage" object is the root container for all the visible things in your scene. 
			app.stage.addChild(bulletYellow); // Add the bulletYellow to the stage.

			//////////////////////////////////////// Bullet - Yellow -2
			bulletYellow2 = new PIXI.Sprite(PIXI.Loader.shared.resources["./assets/jayAssets/bulletYellow.png"].texture); // texture NOT textures
			//Change the sprite's position
			bulletYellow2.x = 530;
			bulletYellow2.y = 379;
			//Change the sprite's size
			bulletYellow2.width = 17; //80;
			bulletYellow2.height = 33; //120;
			//scale to doubled the size
			bulletYellow2.scale.x = 1; // 0.5;
			bulletYellow2.scale.y = 1; // 0.5;
			// Rotation
			// bulletYellow2.rotation = 0.5; // Rotate clockwise and the Pivot at (0,0) top left 
			bulletYellow2.pivot.set(bulletYellow2.width / 2, bulletYellow2.height / 2); // Pivot point moved to (64/2, 64/2)  center of an image of 64x64
			// bulletYellow2.rotation = 0.5; // PRotate clockwise and the Pivot at (32,32) center of an image

			// Anything you want to be made visible in the renderer that has to be added to a special Pixi object called the "stage".
			// "stage" is a Pixi Container object. 
			// "stage" object is the root container for all the visible things in your scene. 
			app.stage.addChild(bulletYellow2); // Add the bulletYellow2 to the stage.

			///////////////////////////////////////// JET
			// create an array of textures from an image path
			const frames = [];

			// for (let i = 0; i < 30; i++) 
			for (let i = 0; i < 1; i++) {
				const val = i < 10 ? `0${i}` : i;

				// magically works since the spritesheet was loaded with the pixi loader
				frames.push(PIXI.Texture.from(`rollSequence00${val}.png`));
			}

			// create an AnimatedSprite (brings back memories from the days of Flash, right ?)
			const anim = new PIXI.AnimatedSprite(frames);

			/*
			* An AnimatedSprite inherits all the properties of a PIXI sprite
			* so you can change its position, its anchor, mask it, etc
			*/
			anim.x = app.screen.width / 2;
			anim.y = app.screen.height - 150; // app.screen.height / 2;
			anim.anchor.set(0.5);
			anim.animationSpeed = 0.5;
			anim.play();

			app.stage.addChild(anim);

			var xOffsetJet = 0;
			var xInitJet = app.screen.width / 2; // 489.5  479.5

			var bulletYoffset = 0;

			// Animate the rotation
			app.ticker.add(() => {
				//anim.rotation += 0.01;
				//    xOffsetJet = (xOffsetJet + 1) %  app.screen.width;
				//    anim.x = xOffsetJet;


				bulletYoffset = bulletYellow.y - 10;
				bulletYellow.y = bulletYoffset < -20 ? 379: bulletYoffset;
				bulletYellow2.y = bulletYellow.y;

				if(bulletYellow.y < -10)
				{
					bulletYellow.x  = 447 - (app.screen.width / 2 - anim.x);
					bulletYellow2.x = 530 - (app.screen.width / 2 - anim.x);
				}


				// console.log(bulletYellow.y);
				// console.log(anim.x);
				
			});

			// keyboard control - start
			//Capture the keyboard arrow keys
			let left = keyboard("ArrowLeft"),
				up = keyboard("ArrowUp"),
				right = keyboard("ArrowRight"),
				down = keyboard("ArrowDown");

			//Left arrow key `press` method
			left.press = () => {
				//Change the cat's velocity when the key is pressed
				// xOffsetJet = (xInitJet + xOffsetJet - 10) %  app.screen.width;
				xInitJet = xInitJet - 10;
				xInitJet = xInitJet < 100 ? 100 : xInitJet;
				anim.x = xInitJet;

				// xOffsetJet = (xInitJet + xOffsetJet - 10) %  app.screen.width;
				// anim.x = xOffsetJet < 100 ? 100 : xOffsetJet;
				// console.log(anim.x);
			};

			/*
			//Left arrow key `release` method
			left.release = () => {
			//If the left arrow has been released, and the right arrow isn't down,
			//and the cat isn't moving vertically:
			//Stop the cat
			if (!right.isDown && cat.vy === 0) {
			cat.vx = 0;
			}
			};
			*/

			//Right
			right.press = () => {
				// xOffsetJet = (xInitJet + xOffsetJet + 10) %  app.screen.width;
				// anim.x = xOffsetJet + 100  > app.screen.width ? app.screen.width - 100 : xOffsetJet;
				xInitJet = xInitJet + 10;
				xInitJet = xInitJet > app.screen.width - 100 ? app.screen.width - 100 : xInitJet;
				anim.x = xInitJet;
				// console.log(anim.x);
			};
			// right.release = () => {
			// if (!left.isDown && cat.vy === 0) {
			// cat.vx = 0;
			// }
			// };

			//Up
			// up.press = () => {
			// cat.vy = -5;
			// cat.vx = 0;
			// };
			// up.release = () => {
			// if (!down.isDown && cat.vx === 0) {
			// cat.vy = 0;
			// }
			// };

			//Down
			// down.press = () => {
			// cat.vy = 5;
			// cat.vx = 0;
			// };
			// down.release = () => {
			// if (!up.isDown && cat.vx === 0) {
			// cat.vy = 0;
			// }
			// };

			// keyboard control - end

		}
	}
}, false);





/**
 * app   - canvas / renderer
 * stage - root container on top of canvas -->
 */



