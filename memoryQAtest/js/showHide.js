window.addEventListener('load', function () {
	// Button class
	class HideShowButton {
		constructor(divName, btnName) {
			this.btn = document.createElement("BUTTON");    // Create a <button> element
			this.btn.innerHTML = btnName || "Show / Hide";  // Insert text
			this.btn.divName = divName;
			divName.style.display = "none"; // hide the solution at the beginning
			document.body.insertBefore(this.btn, divName);  // (newNode, sp2)
		}
	}

	addClickEvent = function(obj) {
		obj.btn.onclick = function () {
			var x = this.divName; // document.getElementById("sridhar");
			if (x.style.display === "none") {
				x.style.display = "block";
				this.innerHTML = "Hide Solution";
			} else {
				x.style.display = "none";
				this.innerHTML = "Show Solution";
			}
		};
	};

	// Generate question and answers
	/*
		<p id="quest"></p>
		<textarea class="textAreaAutoSizing" placeholder="Code here.... !!!" spellcheck="false"></textarea>
		<p id="ans"></p>
	*/
	let noOfQuest = questAns.length || 0;
	for(let i = 0; i < noOfQuest; ++i)
	{
		// Question
		let questElmt = document.createElement("P");
		questElmt.innerHTML = questAns[i].quest;    // Create a <div> element
		document.body.appendChild(questElmt);
		// Text Area
		let txtAreaElmt = document.createElement("TEXTAREA");
		txtAreaElmt.classList = "textAreaAutoSizing";
		txtAreaElmt.placeholder = "Code here.... !!!";
		txtAreaElmt.spellcheck = "false";
		document.body.appendChild(txtAreaElmt);
		// Solution
		let ansElmt = document.createElement("P");
		ansElmt.innerHTML = "<pre><code class='language-cpp hljs'>" + hljs.highlight(questAns[i].ans, {language: 'cpp'}).value + "</code></pre>"; 
		document.body.appendChild(ansElmt);
		addClickEvent(new HideShowButton(ansElmt, 'Show Solution'));
	}

	// text area auto sizing
	let textareaAutoSize = document.querySelector('textarea');
	textareaAutoSize.onkeydown = function () {
		var el = this;
		setTimeout(function(){
		  el.style.cssText = 'height:auto; padding:0';
		  el.style.cssText = 'height:' + el.scrollHeight + 'px';
		},0);
	};
});