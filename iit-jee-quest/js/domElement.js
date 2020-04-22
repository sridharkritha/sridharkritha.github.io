window.addEventListener('load', function () {

// Root Object: documnet
// Root Element: <html></html>
// Branch Elements: <head></head> <body></body> etc.,
// All elements have the appendChild method
createHtmlElement = function(obj) {
	var element = null;
	var prop = null;
	if(obj) {
		if(obj.eType) 	element = document.createElement(obj.eType); // createElement('div');
		if(0) // element) 
		{
			if(obj.id)		element.setAttribute('id', obj.id);
			else if(obj.class)	element.setAttribute('class', obj.class);
			else if(obj.style)	setElementStyle(element, obj.style);
			else if(obj.textValue) {
				var textNode = document.createTextNode(obj.textValue); 
				this.appendToElement(element, textNode);
			}
		}
		else 
		{	
			if(element) {
				for (prop in obj) {
					if (obj.hasOwnProperty(prop)) {
						if(prop === 'eType') continue;
						// "classA classB" => "classA" , "classB"
						// \s+   : one or more white space
						// \",\" : ","
						else if(prop === 'class') element.classList.add(obj[prop].replace(/\s+/g, "\",\""));
						else if(prop === 'id')		element.setAttribute('id', obj[prop]);
						else if(prop === 'style') setElementStyle(element, obj[prop]);
						else if(prop === 'textValue') this.appendToElement(element, document.createTextNode(obj[prop]));
						else element[prop] = obj[prop];
					}
				}
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

// Note: https://javascript.info/modifying-document
// This set of methods provides more ways to insert:
// node.append(...nodes or strings) – append nodes or strings at the end of node,
// node.prepend(...nodes or strings) – insert nodes or strings at the beginning of node,
// node.before(...nodes or strings) –- insert nodes or strings before node,
// node.after(...nodes or strings) –- insert nodes or strings after node,
// node.replaceWith(...nodes or strings) –- replaces node with the given nodes or strings.

appendToElement = function(parentElement, childElement){
	// all elements have the appendChild method
	parentElement.appendChild(childElement);
};

appendToBody = function(childElement){
	// all elements have the appendChild method
	document.body.appendChild(childElement);
};

var divRootContainerElement = this.createHtmlElement({ "eType": "div", "id": "rootContainer", "style":  { 
									"background" 	:"blue", "padding": "2px", // 2px of blue background will be visible bcos of padding
									"border-left"	: "solid 10px red", // 10px of red is visible outside of the padding
									"margin"		: "5px"				// 5px of empty space(colour-less) around the border
							}});
this.appendToBody(divRootContainerElement);

var divQuestionElement;
var divAnswerElements = [];
var divTxtAreaCtrlPanelWrap;
var questionCounter = 0;
var divQuestionWrapper = null;
var divAnswersWrapper  = null;
var divTextAreaWrapper = null;


createAnswerElement = function(index, answerString)
{
	var text = "No answers yet";
	if(answerString) { text = answerString; }
	return this.createHtmlElement({ "eType": "div", "id": "divAnswer" + index, "textValue": text, "style":  { background:"#FFFFEE" }});
};

populateQuestionAnswers = function(questionIndex) {
	// Question
	divQuestionElement.childNodes[0].nodeValue = this.questions[questionIndex].Question;
	// Answers
	var nAnswers = Object.keys(this.questions[questionIndex].Answers).length;
	for(var i = 0; i < nAnswers; ++i) {
		if(divAnswerElements.length > i) {
			divAnswerElements[i].childNodes[0].nodeValue = this.questions[questionIndex].Answers[i];
			this.showElement(divAnswerElements[i].id);
		}
		else {
			divAnswerElements[i] = this.createAnswerElement(i, this.questions[questionIndex].Answers[i]);
			this.appendToElement(divAnswersWrapper, divAnswerElements[i]);
		}
	}

	if(nAnswers < divAnswerElements.length )
	{
		for(i = nAnswers; i < divAnswerElements.length; ++i) {
			this.hideElement(divAnswerElements[i].id);
		}
	}
};


main = function() {
	// WRAPPERS
	// Question Wrappers
	divQuestionWrapper = this.createHtmlElement({ "eType": "div", "class": "divClassQuestionWrapper","id": "divIdQuestionWrapper","style": { "background" :"CRIMSON", "padding": "5px" }});
	this.appendToElement(divRootContainerElement, divQuestionWrapper);
	// Answers Wrappers
	divAnswersWrapper = this.createHtmlElement({ "eType": "div", "class": "divClassAnswersWrapper","id": "divIdAnswersWrapper", "style": { "background" :"GOLD", "padding": "5px" }});
	this.appendToElement(divRootContainerElement, divAnswersWrapper);
	// Text Area Wrapper
	divTextAreaWrapper = this.createHtmlElement({ "eType": "div", "class": "divClassTextAreaWrapper","id": "divIdTextAreaWrapper", "style": { "background" :"OLIVE", "padding": "5px" }});
	this.appendToElement(divRootContainerElement, divTextAreaWrapper);

	// POPULATE THE CONTENTS INSIDE THE WRAPPERS
	// QESTIONS
	divQuestionElement = this.createHtmlElement({ "eType": "div", "id": "divQuestion", "textValue": this.questions[questionCounter].Question, "style":  { background:"#a5d6a7" }});
	this.appendToElement(divQuestionWrapper, divQuestionElement);

	// ANSWERS
	this.populateQuestionAnswers(questionCounter);

	// TEXT AREA
	divTxtAreaCtrlPanelWrap = this.createHtmlElement({ "eType": "div", "class": "textAreaCommon textAreaControlPanelWrapper"});
	// Control panel of text area
	var ulTxtAreaButton = this.createHtmlElement({ "eType": "ul", "class": "ul-txtAreaButton"});
	ulTxtAreaButton.appendChild(this.createHtmlElement({ "eType": "li", "class": "li-txtAreaButton", "id": "li-bold-txtAreaButton"}));
	ulTxtAreaButton.appendChild(this.createHtmlElement({ "eType": "li", "class": "li-txtAreaButton", "id": "li-italic-txtAreaButton"}));
	ulTxtAreaButton.appendChild(this.createHtmlElement({ "eType": "li", "class": "li-txtAreaButton", "id": "li-code-txtAreaButton"}));
	ulTxtAreaButton.appendChild(this.createHtmlElement({ "eType": "li", "class": "li-txtAreaButton", "id": "li-image-txtAreaButton"}));

	divTxtAreaCtrlPanelWrap.appendChild(ulTxtAreaButton);
	this.appendToElement(divTextAreaWrapper, divTxtAreaCtrlPanelWrap);

	// image dialog box
	// divImgDlgBoxWrapper - global object can be used across different files
	divImgDlgBoxWrapper = this.createHtmlElement({ "eType": "div", "class": "divImgDlgBoxWrapper"});
	var dropzone = this.createHtmlElement({ "eType": "div", "class": "dropzone"});
	var info = this.createHtmlElement({ "eType": "div", "class": "info"});
	this.appendToElement(dropzone, info);
	this.appendToElement(divImgDlgBoxWrapper, dropzone);
	this.appendToElement(divTextAreaWrapper, divImgDlgBoxWrapper);

	// message area of text area wrapper
	var divTxtAreaContentWrapper = this.createHtmlElement({ "eType": "div", "class": "textAreaCommon textAreaContentWrapper"});
	var textarea = this.createHtmlElement({ "eType": "textarea", "id": "txtAreaId"});
	divTxtAreaContentWrapper.appendChild(textarea);
	this.appendToElement(divTextAreaWrapper, divTxtAreaContentWrapper);

	// Text area previewer
	var textAreaPreviewer = this.createHtmlElement({ "eType": "div", "id": "textAreaPreviewer"});
	this.appendToElement(divTextAreaWrapper, textAreaPreviewer);

}.bind(this)();


// Database
var nQuestions = Object.keys(this.questions).length; // No. of entries in an object

// Click Event Handler
document.getElementById('btnIdBackward').addEventListener('click', function () {
	questionCounter = (--questionCounter + nQuestions) % nQuestions;
	this.populateQuestionAnswers(questionCounter);
}.bind(this));

document.getElementById('btnIdForward').addEventListener('click', function () {
	questionCounter = (++questionCounter + nQuestions) % nQuestions;
	this.populateQuestionAnswers(questionCounter);
}.bind(this));

showElement = function(id) {
	document.getElementById(id).style.display = 'block'; // show
};

hideElement = function(id) {
	document.getElementById(id).style.display = 'none'; // hide
};

}); // window.addEventListener('load', function() {


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
var divQuestionElement = this.createHtmlElement({ "eType": "div", "id": "divQuestion", "textValue": this.questions[questionCounter].Question, "style":  { background:"#a5d6a7" }});
// this.setElementStyle(divQuestionElement, {  position: "absolute", width:"100%", height:"100%", background:"#EEEEEE" });
// this.createTextNote(divQuestionElement, "Hello Sridhar - Question");
// this.createTextNote(divQuestionElement, "Hello Krishnan - Question");
// var one = this.createHtmlElement({ "eType": "div", "id": "divOne", "style":  { background:"#a5d6a7" }});
// this.appendToElement(divQuestionElement, one);
this.appendToElement(divRootContainerElement, divQuestionElement);
*/

/*
var divAnswerElement = this.createHtmlElement({ "eType": "div", "id": "divAnswer", "style":  { background:"#FFFFEE" }});
this.createTextNote(divAnswerElement, "Hello Jay - Answer");
this.appendToElement(divRootContainerElement, divAnswerElement);

var testElement = this.createHtmlElement({ "eType": "div", "id": "divAnswer", "style":  { background:"#FFFFEE" }});
this.createTextNote(testElement, this.questions["1"]);
this.appendToElement(divRootContainerElement, testElement);

var testElement2 = this.createHtmlElement({ "eType": "div", "id": "divAnswer", "style":  { background:"#FFFFEE" }});
this.createTextNote(testElement2, this.answers["1"]);
this.appendToElement(divRootContainerElement, testElement2);
*/

	/////////////////////////////
	// var divTxtAreaCtrlPanelWrap = this.createHtmlElement({ "eType": "div", "class": "textAreaControlPanelWrapper"});

	// var ulTxtAreaButton = this.createHtmlElement({ "eType": "ul", "class": "ul-txtAreaButton"});
	// ulTxtAreaButton.appendChild(this.createHtmlElement({ "eType": "li", "class": "li-txtAreaButton", "id": "li-bold-txtAreaButton"}));
	// ulTxtAreaButton.appendChild(this.createHtmlElement({ "eType": "li", "class": "li-txtAreaButton", "id": "li-italic-txtAreaButton"}));
	// ulTxtAreaButton.appendChild(this.createHtmlElement({ "eType": "li", "class": "li-txtAreaButton", "id": "li-code-txtAreaButton"}));
	// ulTxtAreaButton.appendChild(this.createHtmlElement({ "eType": "li", "class": "li-txtAreaButton", "id": "li-image-txtAreaButton"}));

	// divTxtAreaCtrlPanelWrap.appendChild(ulTxtAreaButton);



	// <div class="textAreaControlPanelWrapper">
	// 	<ul class="ul-txtAreaButton">
	// 		<li class="li-txtAreaButton" id="li-bold-txtAreaButton"></li>
	// 		<li class="li-txtAreaButton" id="li-italic-txtAreaButton"></li>
	// 		<li class="li-txtAreaButton" id="li-code-txtAreaButton"></li>
	// 		<li class="li-txtAreaButton" id="li-image-txtAreaButton"></li>
	// 	</ul>

	// 	<div class="textAreaContentWrapper">
	// 		<p><textarea id="txtAreaId" name="myTxtArea"> Jay Bose Sridhar </textarea></p> 
	// 	</div>
	// </div>