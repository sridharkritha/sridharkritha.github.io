// Global function : Before document load

// Ref: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
// selectStart: http://help.dottoro.com/ljtqbjui.php
function insertMetachars(sStartTag, sEndTag) {
	var bDouble = arguments.length > 1;
	var oMsgInput = document.getElementById('txtAreaId');
	var nSelStart = oMsgInput.selectionStart;
	var nSelEnd = oMsgInput.selectionEnd;
	var sOldText = oMsgInput.value;
	oMsgInput.value = sOldText.substring(0, nSelStart) + (bDouble ? sStartTag + sOldText.substring(nSelStart, nSelEnd) + sEndTag : sStartTag) + sOldText.substring(nSelEnd);
	oMsgInput.setSelectionRange(bDouble || nSelStart === nSelEnd ? nSelStart + sStartTag.length : nSelStart, (bDouble ? nSelEnd : nSelStart) + sStartTag.length);
	oMsgInput.focus();
}

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

window.addEventListener('load', function () {
	// Auto expand 
	// https://gomakethings.com/automatically-expand-a-textarea-as-the-user-types-using-vanilla-javascript/
	document.addEventListener('input', function (event) {
		if (event.target.tagName.toLowerCase() !== 'textarea') return;
		autoExpand(event.target);
	}, false);

	document.getElementById('preview').addEventListener('click', function () {
		document.getElementById('results').innerHTML = document.getElementById('txtAreaId').value;
	}.bind(this));

	document.getElementById('li-bold-txtAreaButton').addEventListener('click', function () {
		this.insertMetachars('<strong>','</\strong>');
	}.bind(this));

	document.getElementById('li-italic-txtAreaButton').addEventListener('click', function () {
		this.insertMetachars('<em>','</\em>');
	}.bind(this));

	document.getElementById('li-code-txtAreaButton').addEventListener('click', function () {
		this.insertMetachars('<code>','</\code>');
	}.bind(this));

	document.getElementById('li-image-txtAreaButton').addEventListener('click', function () {
		this.insertMetachars('<img>','</\img>');
	}.bind(this));
}); // window.addEventListener('load', function() {