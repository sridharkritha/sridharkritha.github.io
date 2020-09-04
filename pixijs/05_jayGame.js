// NOTE: File access(images) are allowed through web server so run local HTTP server.
// http-server -c-1
// If HTTP server is NOT installed then install by
// npm install -g http-server 
// run the example
// http://127.0.0.1:8080/00_index.html

window.addEventListener('load', function () {

	// Global variables
	let app = null;

	init();


	function init() {
        const app = new PIXI.Application();

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
        
        PIXI.loader
            // .add('./assets/jayAssets/fighter.json')
            // .add('./assets/jayAssets/ufo.jpg')
            .add(["./assets/jayAssets/ufo.png", "./assets/jayAssets/fighter.json"])
            // .add(["./assets/cat.png"])
            .load(onAssetsLoaded);
        
        function onAssetsLoaded() {
            // UFO
            let cat = new PIXI.Sprite(PIXI.Loader.shared.resources["./assets/jayAssets/ufo.png"].texture); // texture NOT textures
            //Change the sprite's position
            cat.x = 96;
            cat.y = 96;	  
            //Change the sprite's size
            cat.width = 80;
            cat.height = 120;
            //scale to doubled the size
            cat.scale.x = 0.5;
            cat.scale.y = 0.5;
            // Rotation
            // cat.rotation = 0.5; // Rotate clockwise and the Pivot at (0,0) top left 
            cat.pivot.set(64/2, 64/2); // Pivot point moved to (64/2, 64/2)  center of an image of 64x64
            // cat.rotation = 0.5; // PRotate clockwise and the Pivot at (32,32) center of an image

            // Anything you want to be made visible in the renderer that has to be added to a special Pixi object called the "stage".
            // "stage" is a Pixi Container object. 
            // "stage" object is the root container for all the visible things in your scene. 
            app.stage.addChild(cat); // Add the cat to the stage.

            // JET

            // create an array of textures from an image path
            const frames = [];
        
            for (let i = 0; i < 30; i++) {
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
            anim.y = app.screen.height / 2;
            anim.anchor.set(0.5);
            anim.animationSpeed = 0.5;
            anim.play();
        
            app.stage.addChild(anim);
        
            // Animate the rotation
            app.ticker.add(() => {
                anim.rotation += 0.01;
            });
        }
    }
}, false);
	
	



/**
 * app   - canvas / renderer
 * stage - root container on top of canvas -->
 */



