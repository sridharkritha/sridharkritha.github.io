// Global function : Before document load



// Auto expand 
// https://gomakethings.com/automatically-expand-a-textarea-as-the-user-types-using-vanilla-javascript/
var autoExpand = function (field) {
	// Reset field height
	field.style.height = 'inherit';
	// Get the computed styles for the element
	var computed = window.getComputedStyle(field);
	// Calculate the height
	var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
	             + parseInt(computed.getPropertyValue('padding-top'), 10)
	             + field.scrollHeight
	             + parseInt(computed.getPropertyValue('padding-bottom'), 10)
	             + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

	field.style.height = height + 'px';
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ref: https://www.bitdegree.org/learn/javascript-addeventlistener
// addEventListener(event, callback, propagationDirection)
// propagationDirection : default to false. i.e, It uses 'BUBBLING' propagation. If True then it uses 'CAPTUREING' propagation.
// Ex: when you have an <img> element in a <div>, and the <img> element is clicked, which click event will have to be handled first ?
// Bubbling (false): click event on the <img> element is handled first, and then click event on the <div> element is handled. 
// CAPTUREING(true): <div> callback handled first and <img> callback handled second.

// NOTE: All 'HTML elements(<h1>, <img>, <div>)' and 'DOM objects (window, xmlHttpRequest)' can listen/react to 'HTML DOM events'. You can attach
// 'addEventListener' to any HTML elements and DOM object for listening to HTML DOM events. 

window.addEventListener('load', function () {
	// Auto expand 
	// https://gomakethings.com/automatically-expand-a-textarea-as-the-user-types-using-vanilla-javascript/
	document.addEventListener('input', function (event) {
		if (event.target.tagName.toLowerCase() !== 'textarea') return;
		autoExpand(event.target);
	}, false);



	// Ref: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
	// selectStart: http://help.dottoro.com/ljtqbjui.php
	insertMetachars = function(sStartTag, sEndTag) {
		var bDouble = arguments.length > 1;
		var oMsgInput = document.getElementById('txtAreaId');
		var nSelStart = oMsgInput.selectionStart;
		var nSelEnd = oMsgInput.selectionEnd;
		var sOldText = oMsgInput.value;
		oMsgInput.value = sOldText.substring(0, nSelStart) + (bDouble ? sStartTag + sOldText.substring(nSelStart, nSelEnd) + sEndTag : sStartTag) + sOldText.substring(nSelEnd);
		oMsgInput.setSelectionRange(bDouble || nSelStart === nSelEnd ? nSelStart + sStartTag.length : nSelStart, (bDouble ? nSelEnd : nSelStart) + sStartTag.length);
		oMsgInput.focus();
	};

	document.getElementById('li-bold-txtAreaButton').addEventListener('click', function () {
		this.insertMetachars('<strong>','</\strong>');
	}.bind(this), false);

	document.getElementById('li-italic-txtAreaButton').addEventListener('click', function () {
		this.insertMetachars('<em>','</\em>');
	}.bind(this));

	document.getElementById('li-code-txtAreaButton').addEventListener('click', function () {
		this.insertMetachars('<code>','</\code>');
	}.bind(this), false);

	document.getElementById('li-image-txtAreaButton').addEventListener('click', function () {
		// toggle the image uploader dialog box
		var showHideToggle = document.querySelector('#divImgDlgBoxWrapperId').style;
		showHideToggle.display = showHideToggle.display === "block" ? "none" : "block";
	}.bind(this), false);

	// text area previewer
	var textAreaRef = document.getElementById('txtAreaId');
	textAreaRef.addEventListener('keyup', function (code) {				// textAreaRef.onkeyup = function() { }
		document.getElementById('textAreaPreviewer').innerHTML = textAreaRef.value;

		// dynamicText += code.key;
		// document.getElementById('textAreaPreviewer').innerHTML += code.key;
		
		// tabspace inside text area: https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
		// https://www.w3schools.com/html/html_entities.asp
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
	}.bind(this), false);


	// Post your answers
	document.querySelector('#buttonPostYourAnswer').addEventListener('click', function () {
		var previewer         = document.querySelector('#textAreaPreviewer');
		var textArea          = document.querySelector('#txtAreaId');

		// add new DIV answer
		addNewAnswerElement(previewer.innerHTML);
		// Update the db answer
		updateDbNewPostedAnswer(previewer.innerHTML);

		// Clear
		previewer.innerHTML = "";
		textArea.value = "";
	}.bind(this), false);

	updateDbNewPostedAnswer = function(postedAnswer) {
		// Update the db answer
		var questionCounter = getQuestionIndex();
		var nAnswers = Object.keys(questions[questionCounter].Answers).length;

		questions[questionCounter].Answers[nAnswers] = postedAnswer;
	};

	updateDbNewPostedQuestion = function(postedTitle, postedQuestion) {
		// Question Count
		var nQuestions = Object.keys(this.questions).length;

		// Update the db answer
		questions[nQuestions] = {};
		questions[nQuestions].Answers = {};
		questions[nQuestions].Title = postedTitle;
		questions[nQuestions].Question = postedQuestion;

		// update database entry count
		updateDbQuestionCount();

		// show the question 
		populateQuestionAnswers(nQuestions);
	};

	setCurrentQuestionElementsVisibleState = function(status) {
		var questionTitle = null;
		var existingQuestion = null;
		var answersWrapper = null;

		if(status === true) {
			questionTitle = document.querySelector('#divQuestionTitle');
			questionTitle.style.display = "block"; // Show question element 

			existingQuestion         = document.querySelector('#divQuestion');
			existingQuestion.style.display = "block"; // Show question element

			answersWrapper         = document.querySelector('#divIdAnswersWrapper');
			answersWrapper.style.display = "block"; // Show answers wrapper element		
		}
		else
		{
			questionTitle = document.querySelector('#divQuestionTitle');
			questionTitle.style.display = "none"; // Hide question element 

			existingQuestion         = document.querySelector('#divQuestion');
			existingQuestion.style.display = "none"; // Hide question element

			answersWrapper         = document.querySelector('#divIdAnswersWrapper');
			answersWrapper.style.display = "none"; // Hide answers wrapper element		
		}
	};	



	// Ask a question
	document.querySelector('#btnIdAskQuestion').addEventListener('click', function () {

		setCurrentQuestionElementsVisibleState(false); // hide the current question elements

		var newQuestion         = document.querySelector('#divIdAskQuestionWrapper');
		newQuestion.style.display = "block"; // show new question wrapper element
	}.bind(this), false);

	// Post your question
	document.querySelector('#btnIdPostQuestion').addEventListener('click', function () {
		
		var questTitle        = document.querySelector('#inputBoxQuestionTitle');
		var textArea          = document.querySelector('#txtAreaId');
		var previewer         = document.querySelector('#textAreaPreviewer');


		// Update the db question
		updateDbNewPostedQuestion(questTitle.value, previewer.innerHTML);

		setCurrentQuestionElementsVisibleState(true); // show the question elements

		var newQuestion         = document.querySelector('#divIdAskQuestionWrapper');
		newQuestion.style.display = "none"; // hide the new question wrapper element

		// Clear
		questTitle.value = "";
		textArea.value = "";
		previewer.innerHTML = "";
	}.bind(this), false);


	



}); // window.addEventListener('load', function() {