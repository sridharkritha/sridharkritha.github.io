window.addEventListener('load', function () {
// Utility Functions
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

	let winnerPredictor = function(range, pickerBoxesId) {
		if(range > 1 && range > pickerBoxesId.length) {
			let overItems = []; // document.getElementById('pickerBoxOneId');
			let indexes = [];
			// [...[...Array(5).keys()].map(x => x+1), ...[...Array(3).keys()].map(x => x+2).reverse()]
			// [1, 2, 3, 4, 5, 4, 3, 2] <= forward and backward movement indexes
			let idxValues = [...[...Array(range).keys()].map(x => x+1), ...[...Array(range - 2).keys()].map(x => x+2).reverse()];
			let indexValuesLength = idxValues.length;

			for(let i = 0, j =   pickerBoxesId.length; i < j; ++i) {
				overItems.push(document.getElementById(pickerBoxesId[i]));
				indexes.push(0);
			}

			let randomPickScroller = function(i) {
				overItems[i].style.gridColumnStart = idxValues[indexes[i]];
				indexes[i] = (indexes[i]+1) % indexValuesLength;
			};

			// delay = ++delay % pickerBoxesId.length;
			setInterval(()=>randomPickScroller(0), 1000);
			setInterval(()=>randomPickScroller(1), 2000);
			setInterval(()=>randomPickScroller(2), 3000);
		}
	};

	// winnerPredictor(6, ['pickerBoxOneId', 'pickerBoxTwoId', 'pickerBoxThreeId']);
	// winnerPredictor(6, ['pickerBoxOneId', 'pickerBoxTwoId']);
////////////////////////////////////////////////////////////////////////////////

	function css( element, property ) {
		let prop =  window.getComputedStyle( element, null ).getPropertyValue( property );
		return window.getComputedStyle( element, null ).getPropertyValue( property );
	}

	// resizeSlidingWindow = function() {
	// 	let shuffleItem = document.getElementById('shuffleItemId');
	// 	let shuffleItemWidth = parseInt( css( shuffleItem, 'width' ), 10 ); // "10.992px" => 10.992
	// 	// let shuffleItemLeft  = parseInt( css( shuffleItem, 'left' ), 10 );

	// 	document.getElementById('slideOverBoxId').style.width = shuffleItemWidth + 'px';
	// 	// document.getElementById('slideOverBoxId').style.left  = shuffleItemLeft + 'px';
	// 	// Note: style.left <= offsetLeft
	// 	document.getElementById('slideOverBoxId').style.left = document.getElementById('shuffleItemId').offsetLeft + 'px';	

	// }();

	function translationAnimation(containerElementId, sliderObjs) {
		let shuffleItemsContainer = document.querySelector('#'+containerElementId);
		let children = shuffleItemsContainer.children; // gets array of children from the parent

		let startPos = children[0].offsetLeft;
		let endPos = children[children.length -  1].offsetLeft - startPos; // containerWidth - shuffleItemWidth;

		let sliderObjects = []; // array of objects
		for (let key in sliderObjs) {
			if (sliderObjs.hasOwnProperty(key)) {
				let obj = {};
				obj.sliderElement = document.querySelector('#'+key);  // slider element
				obj.stopPos = children[sliderObjs[key]].offsetLeft - startPos; // stop position in pixels
				obj.isForwardMove = true;
				obj.isFinalPositionReached = false;
				obj.currentPos = 0;
				obj.delta = randomIntFromInterval(60, 90); // speed of movement = 18; // 
				obj.timeout = randomIntFromInterval(3000, 9000); // between 3 and 9 seconds = 4801; // 
				sliderObjects.push(obj);
				console.log(`delta: ${obj.delta}, timeout: ${obj.timeout}`);
			}
		}

		// let currentPos = 0;
		// let isForwardMove = true;
	
		// let timeout = 4000;
		// let delta = 20;


		// let startPos = elem.style.left;
		// let left = parseInt( css( element, 'left' ), 10 ); // "10.992px" => 10.992
		// let left = element.offsetLeft;

		// let shuffleItemsContainer = document.getElementById('shuffleItemsContainerId');


		// let isFinalPositionReached = false;
		// let shuffleItem = document.getElementById('pickerBoxOneId');
		// let containerWidth = parseInt( css( shuffleItemsContainer, 'width' ), 10 ); // "10.992px" => 10.992
		// let shuffleItemWidth = parseInt( css( shuffleItem, 'width' ), 10 ); // "10.992px" => 10.992
		// let shuffleLastItemLeft = document.getElementById('shuffleLastItemId').offsetLeft;


		let arrayIndex = 0;
		let arrayLength = sliderObjects.length;
		let countFinalPositionReached = 0;
		let startTimeStamp; //  = window.performance.now();
		
		function callbackLoop(currentTimeStamp) {
			if (startTimeStamp === undefined) startTimeStamp = currentTimeStamp;
			let elapsed = currentTimeStamp - startTimeStamp;
			
			if(!sliderObjects[arrayIndex].isFinalPositionReached) {
				if(sliderObjects[arrayIndex].isForwardMove) {
					// currentPos += elapsed * 0.01;
					sliderObjects[arrayIndex].currentPos += sliderObjects[arrayIndex].delta;
					if(sliderObjects[arrayIndex].currentPos < endPos) {
						sliderObjects[arrayIndex].sliderElement.style.transform = 'translateX(' + sliderObjects[arrayIndex].currentPos + 'px)';
					}
					else {
						sliderObjects[arrayIndex].isForwardMove = false;
						sliderObjects[arrayIndex].sliderElement.style.transform = 'translateX(' + endPos + 'px)';
					}
				}
				else {
					// currentPos -= elapsed * 0.01;
					sliderObjects[arrayIndex].currentPos -= sliderObjects[arrayIndex].delta;
					if(sliderObjects[arrayIndex].currentPos > 0) {
						sliderObjects[arrayIndex].sliderElement.style.transform = 'translateX(' + sliderObjects[arrayIndex].currentPos + 'px)';
					}
					else {
						sliderObjects[arrayIndex].isForwardMove = true;
						sliderObjects[arrayIndex].sliderElement.style.transform = 'translateX(' + 0 + 'px)';
					}
				}
			}

			if(!sliderObjects[arrayIndex].isFinalPositionReached && elapsed > sliderObjects[arrayIndex].timeout && 
				Math.abs(sliderObjects[arrayIndex].currentPos - sliderObjects[arrayIndex].stopPos) <= sliderObjects[arrayIndex].delta &&
				((sliderObjects[arrayIndex].isForwardMove && sliderObjects[arrayIndex].currentPos > sliderObjects[arrayIndex].stopPos) || 
				(!sliderObjects[arrayIndex].isForwardMove && sliderObjects[arrayIndex].currentPos < sliderObjects[arrayIndex].stopPos))) {
				sliderObjects[arrayIndex].isFinalPositionReached = true;
				++countFinalPositionReached;
				sliderObjects[arrayIndex].sliderElement.style.transform = 'translateX(' + sliderObjects[arrayIndex].stopPos + 'px)';
				// exit condition - after 3 sec
				if(arrayLength != countFinalPositionReached) window.requestAnimationFrame(callbackLoop);
			}
			else {
				arrayIndex = ++arrayIndex % arrayLength;
				window.requestAnimationFrame(callbackLoop);
			}
		}
		window.requestAnimationFrame(callbackLoop);
	}

	// caller => 	'pickerBoxOneId','shuffleItemsContainerId', 3

	// translationAnimation('shuffleItemsContainerId', { "pickerBoxOneId": 2, "pickerBoxTwoId": 4 });
// 	translationAnimation('shuffleItemsContainerId', { "pickerBoxOneId": 5});
translationAnimation('shuffleItemsContainerId', { "pickerBoxOneId": 5, "pickerBoxTwoId": 1, "pickerBoxThreeId": 0  });


    /*
// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// https://www.youtube.com/watch?v=tS6oP1NveoI
let start, previousTimeStamp;

function step(timestamp) {
  if (start === undefined)
    start = timestamp;
  const elapsed = timestamp - start;

  if (previousTimeStamp !== timestamp) {
    // Math.min() is used here to make sure the element stops at exactly 200px
    const count = Math.min(0.5 * elapsed, timeDuration);
    element.style.transform = 'translateX(' + count + 'px)';
  }

  if (elapsed < timeDuration) { // Stop the animation after 2 seconds
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(step);
  }
}

// 

function translate(elem, duration) {
  element = elem; // global
  timeDuration = duration; // global

//     step(0, elem);
    window.requestAnimationFrame(step);
}

*/

    // java script Animation
    // https://javascript.info/js-animation

    /*
        function animate({duration, draw, timing}) {

        let start = performance.now();
      
        requestAnimationFrame(function animate(time) {
          let timeFraction = (time - start) / duration;
          if (timeFraction > 1) timeFraction = 1;
      
          let progress = timing(timeFraction);
      
          draw(progress);
      
          if (timeFraction < 1) {
            requestAnimationFrame(animate);
          }
      
        });
      }
      
    function translate(elem) {
        animate({
            duration: 5000,
            timing: function(timeFraction) {
              return timeFraction;
            },
            draw: function(progress) {
                // elem.style.width = progress * 100 + '%';
                elem.style.left = progress * 100 + '%';
            }
          });
    }
    */

    // function translate( elem, x, y ) {
    //     var left = parseInt( css( elem, 'left' ), 10 ),
    //         top = parseInt( css( elem, 'top' ), 10 ),
    //         dx = 0,
    //         dy = 0,
    //         i = 1,
    //         count = 200,
    //         delay = 0;

    //         dx = x!= undefined ?   left - x: 0;
    //         dy = y!= undefined ?   top - y: 0;

        
    //     function loop() {
    //         if ( i >= count ) { return; }
    //         i += 1;
    //         elem.style.left = ( left - ( dx * i / count ) ).toFixed( 0 ) + 'px';
    //         elem.style.top = ( top - ( dy * i / count ) ).toFixed( 0 ) + 'px';
    //         setTimeout( loop, delay );
    //     }
        
    //     loop();
    // }
    
    // function css( element, property ) {
    //     return window.getComputedStyle( element, null ).getPropertyValue( property );
    // }


    // let x = 1;
    // leftRightAlternateMove = function(evt) {
    //     evt.style.left = x + 'px';
    //     ++x;
    //     setInterval(()=>leftRightAlternateMove(evt), 1000);
    // };



    let slideOverBox = document.getElementById('pickerBoxOneId');
	slideOverBox.addEventListener('click', function () {
		// leftRightAlternateMove(this);
        // translate(this, 900);
        // translate(this, 2000);
		// translationAnimation(this,0, 600);
		translationAnimation(this, 'shuffleItemsContainerId', 3); // this => 'slideOverBox'

		
	});





});