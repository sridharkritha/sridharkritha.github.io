// Global function : Before document load

// Ref: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
// selectStart: http://help.dottoro.com/ljtqbjui.php
function insertMetachars(sStartTag, sEndTag) {
	var bDouble = arguments.length > 1, oMsgInput = document.myForm.myTxtArea, nSelStart = oMsgInput.selectionStart, nSelEnd = oMsgInput.selectionEnd, sOldText = oMsgInput.value;
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
	//$('#results').html($('textarea').val().replace(/\n/g, '<br>'));
}.bind(this));

}); // window.addEventListener('load', function() {