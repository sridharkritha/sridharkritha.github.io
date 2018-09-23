var scaleFactor = 4;

function my_function()
{
	// Global variables
	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');
	var isImageLoaded = false;
	var index = 0;
	// Timer
	var fps = 1; // (max 60 fps)
	var now;
	var then = Date.now();
	var interval = 1000 / fps;
	var delta;

	var cellWidth = 100,
		cellHeight = 100,
		cellCount = 10;
	var row = 0,
		column = 0,
		rowTotal = 0,
		columnTotal = 0,
		counter = 0;
	var screenX = 0,
		screenY = 0;
	

	var columnStart = 6;
	column = columnStart;

	var img = new Image();
	// Functions
	img.onload = function()
	{
		isImageLoaded = true;
		// ctx.drawImage(img, 0, 0, cellWidth /*img.width / 10 */ , cellHeight /*img.height*/ , 0, 0, cellWidth /*img.width / 10 */ , cellHeight /*img.height*/ );
		rowTotal = img.height / cellHeight;
		columnTotal = img.width / cellWidth;
	}
	img.src = "spriteCoins.png";

	function renderer()
	{
		// Timer
		window.requestAnimationFrame(renderer);
		now = Date.now();
		delta = now - then;

		if(delta > interval)
		{
			// update time stuffs

			// Just `then = now` is not enough.
			// Lets say we set fps at 10 which means
			// each frame must take 100ms
			// Now frame executes in 16ms (60fps) so
			// the loop iterates 7 times (16*7 = 112ms) until
			// delta > interval === true
			// Eventually this lowers down the FPS as
			// 112*10 = 1120ms (NOT 1000ms).
			// So we have to get rid of that extra 12ms
			// by subtracting delta (112) % interval (100).
			// Hope that makes sense.

			then = now - (delta % interval);

			// ... Code for Drawing the Frame ...
			if(isImageLoaded)
			{
				ctx.clearRect(0, 0, canvas.width, canvas.height);
                // INFORMATION TEXT
                ctx.strokeStyle="red";
                ctx.strokeText("Scale Factor : ", 10,10);
                ctx.strokeText(scaleFactor, 80,10);
                
                ctx.strokeText("FPS : ", 10,30);
                ctx.strokeText(fps, 50,30);
                ctx.strokeText("Frame No : ",10,50);
				ctx.strokeText(counter+1,70,50);

                // BOUNDING RECTANGLE
				ctx.rect(canvas.width / 2 - scaleFactor * cellWidth / 2, canvas.height / 2 - scaleFactor * cellHeight / 2, scaleFactor * cellWidth, scaleFactor * cellHeight);
				ctx.stroke();

				ctx.save();
				// Translate -> Rotate -> Scale
				ctx.translate(canvas.width / 2 - scaleFactor * cellWidth / 2, canvas.height / 2 - scaleFactor * cellHeight / 2);
				ctx.scale(scaleFactor, scaleFactor); // Doubles size of anything draw to canvas.			

				// drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
				ctx.drawImage(img, column * cellWidth, row * cellHeight, cellWidth, cellHeight, screenX, screenY, cellWidth, cellHeight);

				ctx.restore();

				if(row < rowTotal - 1)
				{
					++row;
				}
				else if(column < columnTotal - 1)
				{
					row = 0;
					++column;
				}

				if(++counter === cellCount)
				{
					counter = row = 0;
					column = columnStart;
				}

			}
		}
	}
	renderer();
}

function resetValues() {
    var x, text;

    // Get the value of the input field with id="numb"
    x = document.getElementById("numb").value;

    scaleFactor = x;

    // If x is Not a Number or less than one or greater than 10
    if (isNaN(x) || x < 1 || x > 10) {
        text = "Input not valid";
    } else {
        text = "Input OK";
    }
    // document.getElementById("demo").innerHTML = text;
}


// document.onload = my_function();
document.addEventListener('DOMContentLoaded', my_function, false);