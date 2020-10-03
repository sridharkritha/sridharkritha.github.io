// NOTE: File access(images) are allowed through web server so run local HTTP server.
// http-server -c-1
// If HTTP server is NOT installed then install by
// npm install -g http-server 
// run the example
// http://127.0.0.1:8080/00_index.html

let app = null;
let ufo = null;
let graphicsJetRect = null;
const keyDisplacement = 10;
const bulletDisplacement = 15;

var alienBullets = { leftBullet: 0, rightBullet: 0, life: 1 };
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
				  "./assets/jayAssets/bulletYellow.png","./assets/jayAssets/bulletGreen.png",
				  "./assets/jayAssets/mc.json"
				 ])
			// .add(["./assets/ufo.png"])
			.load(onAssetsLoaded);

		function onAssetsLoaded() {
			//////////////////////////////////////// UFO
			ufo = new PIXI.Sprite(PIXI.Loader.shared.resources["./assets/jayAssets/ufo.png"].texture); // texture NOT textures
			ufo.lifeCount = 5;
			//Change the sprite's position
			ufo.x = app.screen.width / 2 - 60;
			ufo.y = app.screen.height / 2 - 300;
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

			//////////////////////////////////////// Jet Bullet - Yellow
			jetBullets = { leftBullet: null, rightBullet: null, life: 1 };
			jetBullets.leftBullet = new PIXI.Sprite(PIXI.Loader.shared.resources["./assets/jayAssets/bulletYellow.png"].texture); // texture NOT textures
			//Change the sprite's position
			var bulletLeftX = app.screen.width / 2 - 43;
			var bulletY = app.screen.height / 2 + 170;
			jetBullets.leftBullet.x = bulletLeftX;// 447;
			jetBullets.leftBullet.y = bulletY; // 379;
			//Change the sprite's size
			jetBullets.leftBullet.width = 17; //80;
			jetBullets.leftBullet.height = 33; //120;
			//scale to doubled the size
			jetBullets.leftBullet.scale.x = 1; // 0.5;
			jetBullets.leftBullet.scale.y = 1; // 0.5;
			// Rotation
			// jetBullets.leftBullet.rotation = 0.5; // Rotate clockwise and the Pivot at (0,0) top left 
			jetBullets.leftBullet.pivot.set(jetBullets.leftBullet.width / 2, jetBullets.leftBullet.height / 2); // Pivot point moved to (64/2, 64/2)  center of an image of 64x64
			// jetBullets.leftBullet.rotation = 0.5; // PRotate clockwise and the Pivot at (32,32) center of an image

			// Anything you want to be made visible in the renderer that has to be added to a special Pixi object called the "stage".
			// "stage" is a Pixi Container object. 
			// "stage" object is the root container for all the visible things in your scene. 
			app.stage.addChild(jetBullets.leftBullet); // Add the jetBullets.leftBullet to the stage.

			//////////////////////////////////////// Bullet - Yellow -2
			jetBullets.rightBullet = new PIXI.Sprite(PIXI.Loader.shared.resources["./assets/jayAssets/bulletYellow.png"].texture); // texture NOT textures
			//Change the sprite's position
			var bulletRightX = app.screen.width / 2 + 40;
			jetBullets.rightBullet.x = bulletRightX;
			jetBullets.rightBullet.y = bulletY;
			//Change the sprite's size
			jetBullets.rightBullet.width = 17; //80;
			jetBullets.rightBullet.height = 33; //120;
			//scale to doubled the size
			jetBullets.rightBullet.scale.x = 1; // 0.5;
			jetBullets.rightBullet.scale.y = 1; // 0.5;
			// Rotation
			// jetBullets.rightBullet.rotation = 0.5; // Rotate clockwise and the Pivot at (0,0) top left 
			jetBullets.rightBullet.pivot.set(jetBullets.rightBullet.width / 2, jetBullets.rightBullet.height / 2); // Pivot point moved to (64/2, 64/2)  center of an image of 64x64
			// jetBullets.rightBullet.rotation = 0.5; // PRotate clockwise and the Pivot at (32,32) center of an image

			// Anything you want to be made visible in the renderer that has to be added to a special Pixi object called the "stage".
			// "stage" is a Pixi Container object. 
			// "stage" object is the root container for all the visible things in your scene. 
			app.stage.addChild(jetBullets.rightBullet); // Add the jetBullets.rightBullet to the stage.
	
			//////////////////////////////////////// Bullet - Green -1
			alienBullets = { leftBullet: null, rightBullet: null, life: 1 };
			alienBullets.leftBullet = new PIXI.Sprite(PIXI.Loader.shared.resources["./assets/jayAssets/bulletGreen.png"].texture); // texture NOT textures
			//Change the sprite's position
			var alienBulletY = app.screen.height / 2 - 350;
			alienBullets.leftBullet.x = bulletLeftX;
			alienBullets.leftBullet.y = alienBulletY;
			//Change the sprite's size
			alienBullets.leftBullet.width = 17; //80;
			alienBullets.leftBullet.height = 33; //120;
			//scale to doubled the size
			alienBullets.leftBullet.scale.x = 1; // 0.5;
			alienBullets.leftBullet.scale.y = 1; // 0.5;
			// Rotation
			alienBullets.leftBullet.pivot.set(jetBullets.rightBullet.width / 2, jetBullets.rightBullet.height / 2); // Pivot point moved to (64/2, 64/2)  center of an image of 64x64
			
			// Anything you want to be made visible in the renderer that has to be added to a special Pixi object called the "stage".
			// "stage" is a Pixi Container object. 
			// "stage" object is the root container for all the visible things in your scene. 
			app.stage.addChild(alienBullets.leftBullet); // Add the jetBullets.rightBullet to the stage.
			//////////////////////////////////////// Bullet - Green -2
			alienBullets.rightBullet = new PIXI.Sprite(PIXI.Loader.shared.resources["./assets/jayAssets/bulletGreen.png"].texture); // texture NOT textures
			//Change the sprite's position
			alienBullets.rightBullet.x = bulletRightX;
			alienBullets.rightBullet.y = alienBulletY;
			//Change the sprite's size
			alienBullets.rightBullet.width = 17; //80;
			alienBullets.rightBullet.height = 33; //120;
			//scale to doubled the size
			alienBullets.rightBullet.scale.x = 1; // 0.5;
			alienBullets.rightBullet.scale.y = 1; // 0.5;
			// Rotation
			alienBullets.rightBullet.pivot.set(jetBullets.rightBullet.width / 2, jetBullets.rightBullet.height / 2); // Pivot point moved to (64/2, 64/2)  center of an image of 64x64
			
			// Anything you want to be made visible in the renderer that has to be added to a special Pixi object called the "stage".
			// "stage" is a Pixi Container object. 
			// "stage" object is the root container for all the visible things in your scene. 
			app.stage.addChild(alienBullets.rightBullet); // Add the jetBullets.rightBullet to the stage.

			///////////////////////////////////// alien rectangle
			// Rectangle
			const graphicsAlienRect = new PIXI.Graphics();
			graphicsAlienRect.lineStyle(2, 0xFFFFFF, 1);
			//graphicsAlienRect.beginFill();
			graphicsAlienRect.drawRect(ufo.x - 12, ufo.y -20, ufo.width, ufo.height);
			graphicsAlienRect.endFill();
			app.stage.addChild(graphicsAlienRect);


			///////////////////////////////////////// JET
			// create an array of textures from an image path
			const frames = [];

			// for (let i = 0; i < 30; i++) 
			for (let i = 0; i < 1; i++) {
				const val = i < 10 ? `0${i}` : i;

				// magically works since the spritesheet was loaded with the pixi loader
				frames.push(PIXI.Texture.from(`rollSequence00${val}.png`)); // JET
			}

			// create an AnimatedSprite (brings back memories from the days of Flash, right ?)
			const jetMachine = new PIXI.AnimatedSprite(frames);

			/*
			* An AnimatedSprite inherits all the properties of a PIXI sprite
			* so you can change its position, its anchor, mask it, etc
			*/
			jetMachine.lifeCount = 5;
			jetMachine.x = app.screen.width / 2;
			jetMachine.y = app.screen.height / 2 + 200;
			jetMachine.anchor.set(0.5);
			jetMachine.animationSpeed = 0.5;
			jetMachine.play();

			app.stage.addChild(jetMachine);

			///////////////////////////////////// rectangle - jet 
			// Rectangle
			graphicsJetRect = new PIXI.Graphics();
			graphicsJetRect.lineStyle(2, 0xFFFFFF, 1);
			//graphicsJetRect.beginFill();
			graphicsJetRect.drawRect(jetMachine.x - 78, jetMachine.y -30, ufo.width +0, ufo.height+50);
			graphicsJetRect.endFill();
			app.stage.addChild(graphicsJetRect);

			////////////////////////////////// Explosion ///////////////////////////////////////////////////////////////
			// create an array to store the textures
			const explosionTextures = [];
			for (i = 0; i < 26; i++) {
				const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
				explosionTextures.push(texture);
			}

			// create an explosion AnimatedSprite
			const explosion = new PIXI.AnimatedSprite(explosionTextures);
			// for (i = 0; i < 50; i++)
			for (i = 0; i < 1; i++) 
			{
				// // create an explosion AnimatedSprite
				// 	const explosion = new PIXI.AnimatedSprite(explosionTextures);
					explosion.x = ufo.x + 60;
					explosion.y = ufo.y + 20;

					explosion.anchor.set(0.5);
					explosion.rotation = Math.random() * Math.PI;
					explosion.scale.set(0.75 + Math.random() * 0.5);

					explosion.alpha = 0; // hide
					app.stage.addChild(explosion);
				}
			//////////////////////////////////////////////////////////////////////////////////////////////////////

			var xInitJet = app.screen.width / 2; // 489.5  479.5

			var bulletYoffset = 0;
			var alienBulletY_offset = 0;

			// Animate the rotation
			app.ticker.add(() => {
				// /*
				// Check the Alien life
				if(ufo.lifeCount)
				{
					if((jetBullets.leftBullet.y < ufo.y - 20 + ufo.height) && (jetBullets.leftBullet.y > ufo.y - 20 + ufo.height - bulletDisplacement) )
					{
						if((jetBullets.leftBullet.x > ufo.x - 12) && jetBullets.leftBullet.x < (ufo.x - 12 + ufo.width))
						{
							--ufo.lifeCount;
							if(!ufo.lifeCount)
							{
									explosion.alpha = 1; // show
									explosion.play();
									setTimeout(function() { 
										explosion.stop(); 
										explosion.alpha = 0; // hide
										ufo.alpha = 0;       // hide
										alienBullets.life = 0;
										alienBullets.leftBullet.alpha = 0;
										alienBullets.rightBullet.alpha = 0;
										graphicsAlienRect.alpha = 0;
									}.bind(this) , 1000);
							}
						}
					}
				}
				// */

				// Check the JET life
				if(jetMachine.lifeCount)
				{
					if((alienBullets.rightBullet.y < jetMachine.y - 20 + jetMachine.height) && (alienBullets.rightBullet.y > jetMachine.y - 20 + jetMachine.height - bulletDisplacement) )
					{
						if((alienBullets.rightBullet.x > jetMachine.x - 12) && alienBullets.rightBullet.x < (jetMachine.x - 12 + jetMachine.width))
						{
							--jetMachine.lifeCount;
							if(!jetMachine.lifeCount)
							{
									explosion.alpha = 1; // show
									explosion.play();
									setTimeout(function() { 
										explosion.stop(); 
										explosion.alpha = 0; // hide
										jetMachine.alpha = 0;       // hide
										jetBullets.life = 0;
										jetBullets.leftBullet.alpha = 0;
										jetBullets.rightBullet.alpha = 0;
										graphicsJetRect.alpha = 0;
									}.bind(this) , 1000);
							}
						}
					}
				}

				// Jet Bullet
				bulletYoffset = jetBullets.leftBullet.y - bulletDisplacement;
				jetBullets.leftBullet.y = bulletYoffset < -25 ? bulletY: bulletYoffset;
				jetBullets.rightBullet.y = jetBullets.leftBullet.y;
				if(jetBullets.leftBullet.y < -10)
				{
					jetBullets.leftBullet.x  = bulletLeftX -  (app.screen.width / 2 - jetMachine.x);
					jetBullets.rightBullet.x = bulletRightX - (app.screen.width / 2 - jetMachine.x);
				}

				// Alien Bullet
				if(alienBullets.life)
				{
					alienBulletY_offset = alienBullets.leftBullet.y + 15;
					alienBullets.leftBullet.y = alienBulletY_offset < app.screen.height + 25 ? alienBulletY_offset : alienBulletY;
					alienBullets.rightBullet.y = alienBullets.leftBullet.y;
				}
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
				xInitJet -= keyDisplacement;
				if(xInitJet < 100)
				{
					xInitJet = 100;
				}
				else
				{
					graphicsJetRect.position.x -= keyDisplacement;
				}
				jetMachine.x = xInitJet;
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
				xInitJet = xInitJet + keyDisplacement;
				if(xInitJet > app.screen.width - 100)
				{
					xInitJet = app.screen.width - 100;
				}
				else
				{
					graphicsJetRect.position.x += keyDisplacement;
				}
				jetMachine.x = xInitJet;
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



