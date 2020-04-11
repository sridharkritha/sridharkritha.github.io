window.addEventListener('load', function () {

// Root Object: documnet
// Root Element: <html></html>
// Branch Elements: <head></head> <body></body> etc.,
// All elements have the appendChild method
createElement = function(obj) {
	var element = null;
	if(obj) {
		if(obj.type) 	element = document.createElement(obj.type); // createElement('div');
		if(element) {
			if(obj.id)		element.setAttribute('id', obj.id);
			if(obj.class)	element.setAttribute('class', obj.class);
			if(obj.style)	setElementStyle(element, obj.style);
			if(obj.textValue) {
				var textNode = document.createTextNode(obj.textValue); 
				this.appendToElement(element, textNode);
			}
		}
	}
	return element; 
};

setElementStyle = function(element, styleObject) {
	Object.assign(element.style, styleObject); // append to the existing style instead of overwritting.
};

createTextNote = function(parentElement, text) {
	// Note: Unlike DOM element, text NODE does NOT have 'id' property. So you can NOT access by 'document.getElementById()'.
	// Also text node is NOT consider as a child, it is a content of the parent element.
	// myDiv.children.length; Excludes the text node
	// myDiv.childNodes.length; Includes the text node. Returns a live NodeList of child nodes of the given element.
	var textNode = document.createTextNode(text); 
	this.appendToElement(parentElement, textNode);
};

appendToElement = function(parentElement, childElement){
	// all elements have the appendChild method
	parentElement.appendChild(childElement);
};

appendToBody = function(childElement){
	// all elements have the appendChild method
	document.body.appendChild(childElement);
};


var divRootContainerElement = this.createElement({ "type": "div", "id": "rootContainer", "style":  { 
							"background" 	:"blue", "padding": "2px", // 2px of blue background will be visible bcos of padding
							"border-left"	: "solid 10px red", // 10px of red is visible outside of the padding
							"margin"		: "5px"				// 5px of empty space(colour-less) around the border
						}});
this.appendToBody(divRootContainerElement);


var divQuestionElement = this.createElement({ "type": "div", "id": "divQuestion", "textValue": "Hello World", "style":  { background:"#a5d6a7" }});
// this.setElementStyle(divQuestionElement, {  position: "absolute", width:"100%", height:"100%", background:"#EEEEEE" });
// this.createTextNote(divQuestionElement, "Hello Sridhar - Question");
// this.createTextNote(divQuestionElement, "Hello Krishnan - Question");
// var one = this.createElement({ "type": "div", "id": "divOne", "style":  { background:"#a5d6a7" }});
// this.appendToElement(divQuestionElement, one);
this.appendToElement(divRootContainerElement, divQuestionElement);
/*
var divAnswerElement = this.createElement({ "type": "div", "id": "divAnswer", "style":  { background:"#FFFFEE" }});
this.createTextNote(divAnswerElement, "Hello Jay - Answer");
this.appendToElement(divRootContainerElement, divAnswerElement);

var testElement = this.createElement({ "type": "div", "id": "divAnswer", "style":  { background:"#FFFFEE" }});
this.createTextNote(testElement, this.questions["1"]);
this.appendToElement(divRootContainerElement, testElement);

var testElement2 = this.createElement({ "type": "div", "id": "divAnswer", "style":  { background:"#FFFFEE" }});
this.createTextNote(testElement2, this.answers["1"]);
this.appendToElement(divRootContainerElement, testElement2);
*/
var nQuestions = Object.keys(this.questions).length; // No. of entries in an object
var questionCounter = 0;
// Click Event Handler
document.getElementById('btnIdBackward').addEventListener('click', function () {
	if(questionCounter > 0) --questionCounter;

	divQuestionElement.childNodes[0].nodeValue = this.questions[questionCounter];
	this.appendToElement(divRootContainerElement, divQuestionElement);
}.bind(this));

document.getElementById('btnIdForward').addEventListener('click', function () {
	if(questionCounter < nQuestions) ++questionCounter;

	var childs = divQuestionElement.childNodes;
	childs[0].nodeValue = this.questions[questionCounter];
	this.appendToElement(divRootContainerElement, divQuestionElement);
}.bind(this));


}); // window.addEventListener('load', function() {


