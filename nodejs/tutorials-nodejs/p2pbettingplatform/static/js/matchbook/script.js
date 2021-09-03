window.addEventListener('load', function () {
// Utility Functions
function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/////////////////////////////////// TEST ///////////////////////////////////////
// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
// https://stackoverflow.com/questions/3103962/converting-html-string-into-dom-elements?noredirect=1&lq=1

// https://stackoverflow.com/questions/23030080/get-text-of-nested-childnodes-javascript

// if (parg.hasChildNodes()) {
// 	let children = parg.childNodes;



/**
 * @param {String} HTML representing a single element
 * @return {Element}
 */
 function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;

	var a = template.content.firstChild;
	var b = template.content.childNodes;
	return template.content;
 }
 
 function test() {
	// let parElem = document.createElement("div");
	// parElem.innerText = "parent";
	// let child_1_Elem = document.createElement("div");
	// child_1_Elem.innerText = "child 1";
	// let child_2_Elem = document.createElement("div");
	// child_2_Elem.innerText = "child 2";
	// parElem.append(child_1_Elem,child_2_Elem );
	// document.body.appendChild(parElem);


	let htmlString = `
	<div id="grantID" class="grantClass11"> I'm grandDad - krishnan
	<div id="parentID" class="parentClass13  parentClass23 parentClass33"> I'm son - sridhar
		<div id="sonID" class="sonClass12  sonClass22"> I'm Jay
			<div>&nbsp;toys&#10004;</div>
			<div id="yId">youtube</div>
			<div class="sClass">school</div>
		</div>
	</div>
	<div id="siblingParentId" class="siblingparentClass12 siblingparentClass22" disabled> I'm son - muthu
		<input type="number" id="myInputId" placeholder="12.34">
		<div>
			<img alt="silk" class="mySilkClass11" src="assets/matchbook/pinkSilk.png">
		</div>
	</div>
 	</div>
	`;
 
	var result = htmlToElement(htmlString);
	console.log(result.childNodes);

	// browsing through childNodes of childNodes
	for(let i = 0, m = result.childNodes.length; i < m; ++i) {
		for(let j = 0, n = result.childNodes[i].childNodes.length; j < n; ++j) {
			console.log(result.childNodes[i].childNodes[j].childNodes);
		}
	}
}
// test();
/*
child.localName +'#'+ child.id + '.'+child.className
k.replace(/\s+/g,'.');


childNodes[0].parentElement <= id


className: "parentClass13  parentClass23 parentClass33"
id: "parentID"


nodeName: "DIV"
nodeType: 1
nodeValue: null

localName: "div"
nodeName: "DIV"




nodeName: "#text"
nodeType: 3
nodeValue: " I'm son - sridhar\n\t\t\t"



nodeName: "#text"
nodeType: 3
nodeValue: "\n\t\t\t"
*/

function createDomElement(propObj) {
	let elemRef = null;

	if(propObj.nodeName) {
		if(propObj.nodeType === 3) { // '#text' - node
			elemRef = document.createTextNode(propObj.nodeValue);
		}
		else {
			elemRef = document.createElement(propObj.nodeName);
			for (let key in propObj) {
				if (propObj.hasOwnProperty(key)) {
					elemRef.setAttribute(key,propObj[key]);
					// elem2.appendChild(elemRef);
				}
			}
		}
	}
	return elemRef;
}

function cloneAttributes(target, source) {
	[...source.attributes].forEach( attr => { target.setAttribute(attr.nodeName ,attr.nodeValue) })
}

function extractNodeInfo(node) {
    let propObj = {};

    if(node.attributes) {
    	    [...node.attributes].forEach( attr => { 
		propObj[attr.nodeName] = attr.nodeValue;
	    // target.setAttribute(attr.nodeName ,attr.nodeValue) 
		// 	    id: "grantID"
		// class: "grantClass11"
	});
    }

	propObj.nodeName =  node.nodeName; // "DIV"
	propObj.nodeType =  node.nodeType; // 1
	propObj.nodeValue =  node.nodeValue; // "DIV"
	propObj.parentElement =  node.parentElement; // "div#htmlStringWrapper


    

    
// nodeName: "DIV"
// nodeType: 1
// nodeValue: null
// id: "grantID"
// className: "grantClass11"
// parentElement: div#htmlStringWrapper


	createDomElement(propObj);
}

let lookupTable = {};
function domTree (node) {
	for (var i = 0; i < node.childNodes.length; i++) {
	  var child = node.childNodes[i];
	  if(child.nodeType != 3 || (child.nodeType === 3 && child.nodeValue.trim())) {
		console.log(child);
		lookupTable[child.parentElement] = child.parentElement;
		extractNodeInfo(child);
	  }

	  domTree(child);
	}
 }

function allDescendants (node) {
	for (var i = 0; i < node.childNodes.length; i++) {
	  var child = node.childNodes[i];
	  if(child.nodeType != 3 || (child.nodeType === 3 && child.nodeValue.trim())) {
		console.log(child);
	  }

	  allDescendants(child);
	}
 }

function GetChildNodes (container) {
	function recursor(container){
		   for (var i = 0; i < container.childNodes.length; i++) {
			  var child = container.childNodes[i];
			  console.log(child)
			  recursor(child);
			//   if(child.nodeType !== 3&&child.childNodes){
			// 	 recursor(child);
			//   }else{
			// 	 var str=child.nodeValue;
			// 	 if(str.indexOf('bbb')>-1){child.nodeValue='some other text'};
			// 	 }
		    }
	}
	recursor(container);
 }


function getText(node) {
	function recursor(n) {
	    var i, a = [];
	    if (n.nodeType !== 3) {
		   if (n.childNodes)
			   for (i = 0; i < n.childNodes.length; ++i)
				  a = a.concat(recursor(n.childNodes[i]));
	    } else
		   a.push(n.data);
	    return a;
	}
	return recursor(node);
 }
 // then
//  console.log(getText(document.getElementById('grantID')));
//  console.log(GetChildNodes(document.getElementById('grantID')));
// GetChildNodes(document.getElementById('htmlStringWrapper'));
// allDescendants(document.getElementById('htmlStringWrapper'));
domTree(document.getElementById('htmlStringWrapper'));

 

////////////////////////////////////////////////////////////////////////////////

// stack addition and subtraction
const backValue = document.getElementById('backValueId'); 

let subtractBack = document.getElementById('subtractBackId');
subtractBack.addEventListener('click', function () {
	const value = Number(backValue.value);
	if(value > 0.5) {
		document.getElementById('backValueId').value = (value - 0.5).toFixed(2);
	}
	else document.getElementById('backValueId').value = (0).toFixed(2);
});

let additionBack = document.getElementById('additionBackId');
additionBack.addEventListener('click', function () {
	const value = Number(backValue.value);
	if(value) {
		document.getElementById('backValueId').value = (value+ 0.5).toFixed(2);
	}
	else document.getElementById('backValueId').value = (0.5).toFixed(2);
});

// Place a bet
let placeBetButton = document.getElementById('placeBetButtonId');
placeBetButton.addEventListener('click', function () {
	const value = Number(backValue.value);
	if(value) {
		document.getElementById('backValueId').value = (value+ 0.5).toFixed(2);
	}
	else console.error("Invalid bet amount");
});

// Delete the bet slip
let deleteBetButton = document.getElementById('deleteBetButtonId');
deleteBetButton.addEventListener('click', function () {
	document.getElementById('betSlipContainer').style.display = 'none';
});

//////////////////////////// Read json by fetch api ////////////////////////////
fetch('sportsDB.json')	// return promise so it needs 'then' and 'catch'
.then((res)  => {        // executes if resolved otherwise go to next line
	if(res.status != 200) {
		throw new Error('cannot fetch the data'); // automatically it became 'reject' promise and function exits
	}
	console.log(res);           // data is hidden inside the 'body' property
	// console.log(res.json()); // data is available but .json() return promise so return it to another 'then'
	return res.json();          // return promise / chaining
})
.then((data) => { 
	console.log(data);
	processInputData(data);
}) // 'then' for 'res.json()' promise.
.catch((err) => { 
	console.log(err); // executes if rejected
});

//////////////////////////// Dynamically construct - Race Card /////////////////
function processInputData(data) {
	const gameName = 'horseRace';
	const region = 'uk';
	const raceName = 'Cartmel';
	const date = '2021-09-20';
	const time = '12:00';

	const ref = data[gameName][region][raceName][date][time];
	const matchType = ref.matchType;
	const runLength = ref.runLength;
	const players = ref.players;


	let raceCardContainer = document.getElementById('sportsEventContainer');


	let elem = document.createElement("div");
	elem.innerHTML = time + '&nbsp' + raceName;
	raceCardContainer.appendChild(elem);

	elem = document.createElement("div");
	elem.innerHTML = matchType + '&nbsp' + '|' + '&nbsp' + runLength;
	raceCardContainer.appendChild(elem);

	for(let i = 0, n = 2 /*players.length*/; i < n; ++i) {
		// 1st row
		let elem1 = document.createElement("div");
		elem1.classList = "gridColumnLayout gridColumnLayout_2 size_4_6 gameBetContainer";
		raceCardContainer.appendChild(elem1);
		let elem2 = document.createElement("div");
		elem2.classList = "gridColumnLayout gridColumnLayout_2 size_1_9 gameContainer";
		elem1.appendChild(elem2);
		// silk
		let elem3 = document.createElement("div");
		elem2.appendChild(elem3);
		let elem4 = document.createElement("img");
		elem4.src = players[i].silk;
		elem3.appendChild(elem4);
		// Horse Name
		elem3 = document.createElement("div");
		elem2.appendChild(elem3);
		elem4 = document.createElement("div");
		elem4.classList = "player";
		elem4.innerHTML = players[i].horseName;
		elem3.appendChild(elem4);
		// Jockey and Trainer Name
		elem4 = document.createElement("div");
		elem4.classList = "playerDesc";
		elem4.innerHTML = 'J:' + players[i].jockeyName + '&nbsp' + 'T:'+ players[i].trainerName;
		elem3.appendChild(elem4);

		// odd range - back
		elem2 = document.createElement("div");
		elem2.classList = "gridColumnLayout gridColumnLayout_6 backLayBetContainer cellSize";
		elem1.appendChild(elem2);
		// 111
		elem3 = document.createElement("div");
		elem3.classList = "backBetLowContainer backOthersBgColor";
		elem3.setAttribute("id","oddSelected_xxx"); //   oddSelected_111
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].backOdds[0];
		// elem3.appendChild(elem4);

		elem5 = document.createElement("div");
		elem5.classList = "totalAmt";
		elem5.innerHTML = "£ " + players[i].backOdds[0];
		// elem3.appendChild(elem5);
		elem3.append(elem4,elem5);

		// 122
		elem3 = document.createElement("div");
		elem3.classList = "backBetMidContainer backOthersBgColor";
		elem3.setAttribute("id","oddSelected_122");
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].backOdds[1];
		elem3.appendChild(elem4);

		elem4 = document.createElement("div");
		elem4.classList = "totalAmt";
		elem4.innerHTML = "£ " + players[i].backOdds[1];
		elem3.appendChild(elem4);

		// 133
		elem3 = document.createElement("div");
		elem3.classList = "backBetHighContainer backMainBgColor";
		elem3.setAttribute("id","oddSelected_133");
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].backOdds[2];
		elem3.appendChild(elem4);

		elem4 = document.createElement("div");
		elem4.classList = "totalAmt";
		elem4.innerHTML = "£ " + players[i].backOdds[2];
		elem3.appendChild(elem4);

		// odd range - lay
		// 144
		elem3 = document.createElement("div");
		elem3.classList = "layBetLowContainer layMainBgColor";
		elem3.setAttribute("id","oddSelected_144");
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].layOdds[0];
		elem3.appendChild(elem4);

		elem4 = document.createElement("div");
		elem4.classList = "totalAmt";
		elem4.innerHTML = "£ " + players[i].layOdds[0];
		elem3.appendChild(elem4);

		// 155
		elem3 = document.createElement("div");
		elem3.classList = "layBetMidContainer layOthersBgColor";
		elem3.setAttribute("id","oddSelected_155");
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].layOdds[1];
		elem3.appendChild(elem4);

		elem4 = document.createElement("div");
		elem4.classList = "totalAmt";
		elem4.innerHTML = "£ " + players[i].layOdds[1];
		elem3.appendChild(elem4);

		// 166
		elem3 = document.createElement("div");
		elem3.classList = "layBetHighContainer layOthersBgColor";
		elem3.setAttribute("id","oddSelected_166");
		elem2.appendChild(elem3);

		elem4 = document.createElement("div");
		elem4.classList = "odd";
		elem4.innerHTML = players[i].layOdds[2];
		elem3.appendChild(elem4);

		elem4 = document.createElement("div");
		elem4.classList = "totalAmt";
		elem4.innerHTML = "£ " + players[i].layOdds[2];
		elem3.appendChild(elem4);	
	}

	// bet slip container
	let oddSelectedXXX = document.getElementById('oddSelected_xxx');
		oddSelectedXXX.addEventListener('click', function () {
		document.getElementById('betSlipContainer').style.display = 'block';
	});
}

//////////////////////////// Dynamically construct - Bet slip //////////////////
let betSlipSheet = {};
function populateBetSlipSheet() {

}


///////////////////////////// Odd range selection //////////////////////////////
let oddSelected = document.getElementById('oddSelected_111');
oddSelected.addEventListener('click', function () {
	document.getElementById('betSlipContainer').style.display = 'block';
});

////////////////////////////////////////////////////////////////////////////////

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