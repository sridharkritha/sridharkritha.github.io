// Ref: https://github.com/carry0987/Imgur-Upload

/* Imgur Upload Script */
(function (root, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) { define([], factory); } 
	else if (typeof exports === 'object') { module.exports = factory(); } 
	else { root.Imgur = factory(); }
}(this, function () {
	"use strict";
	var Imgur = function (options) {
		if (!this || !(this instanceof Imgur)) { return new Imgur(options); }
		if (!options) { options = {}; }
		if (!options.clientid) { throw 'Provide a valid Client Id here: https://api.imgur.com/'; }

		this.clientid = options.clientid;
		this.endpoint = 'https://api.imgur.com/3/image';
		this.callback = options.callback || undefined;
		this.dropzone = document.querySelectorAll('.dropzone');
		this.info = document.querySelectorAll('.info');

		this.run();
	};

	Imgur.prototype = {

		insertAfter: function (referenceNode, newNode) {
			referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
		},

		post: function (path, data, callback) {
			var xhttp = new XMLHttpRequest();

			xhttp.open('POST', path, true);
			xhttp.setRequestHeader('Authorization', 'Client-ID ' + this.clientid);
			xhttp.onreadystatechange = function () {
				if (this.readyState === 4) {
					if (this.status >= 200 && this.status < 300) {
						var response = '';
						try {
							response = JSON.parse(this.responseText);
						} catch (err) {
							response = this.responseText;
						}
						callback.call(window, response);
					} else {
						throw new Error(this.status + " - " + this.statusText);
					}
				}
			};
			xhttp.send(data);
			xhttp = null;
		},

		createDragZone: function () {
			var p1, p2, input;

			p1 = createHtmlElement({ "eType": 'p', 'textValue': 'Drop Image File Here' });
			p2 = createHtmlElement({ "eType": 'p', 'textValue': 'Or click here to select image' });
			input = createHtmlElement({ "eType": 'input', type: 'file', "class": 'input', accept: 'image/*' });

			Array.prototype.forEach.call(this.info, function (zone) {
				zone.appendChild(p1);
				zone.appendChild(p2);
			}.bind(this));
			Array.prototype.forEach.call(this.dropzone, function (zone) {
				zone.appendChild(input);
				this.status(zone);
				this.upload(zone);
			}.bind(this));
		},

		loading: function () {
			var div, table, img;
			div = createHtmlElement({ "eType": "div", "class": "loading-modal" });
			table = createHtmlElement({ "eType": 'table', "class": 'loading-table' });
			img = createHtmlElement({ "eType": 'img', "class": 'loading-image', src: './css/imgur/loading-spin.svg' });

			div.appendChild(table);
			table.appendChild(img);
			appendToElement(divImgDlgBoxWrapper, div); // divImgDlgBoxWrapper - global object
		},

		status: function (el) {
			var div = createHtmlElement({ "eType": 'div', "class": 'status', "id": "uploadStatus" });
			appendToElement(document.getElementById('textAreaPreviewer'), div);
		},

		matchFiles: function (file, zone) {
			// var status = zone.nextSibling;
			var status = document.getElementById('uploadStatus');

			if (file.type.match(/image/) && file.type !== 'image/svg+xml') 
			{
				// document.body.classList.add('loading');
				// status.classList.remove('bg-success', 'bg-danger');
				// status.innerHTML = '';

				// FormData object lets you compile a set of key/value pairs to send using XMLHttpRequest. 
				var fd = new FormData();
				fd.append('image', file); // key value pair. "image" = file

				this.post(this.endpoint, fd, function (data) {
					document.body.classList.remove('loading');
					typeof this.callback === 'function' && this.callback.call(this, data);
				}.bind(this));
			} 
			else 
			{
				status.classList.remove('bg-success');
				status.classList.add('bg-danger');
				status.innerHTML = 'Invalid archive';
			}
		},

		upload: function (zone) {
			var events = ['dragenter', 'dragleave', 'dragover', 'drop'],
				file, target, i, len;

			zone.addEventListener('change', function (e) {
				if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
					target = e.target.files;

					for (i = 0, len = target.length; i < len; i += 1) {
						file = target[i];
						this.matchFiles(file, zone);
					}
				}
			}.bind(this), false);

			events.map(function (event) {
				zone.addEventListener(event, function (e) {
					if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
						if (event === 'dragleave' || event === 'drop') {
							e.target.parentNode.classList.remove('dropzone-dragging');
						} else {
							e.target.parentNode.classList.add('dropzone-dragging');
						}
					}
				}, false);
			});
		},

		run: function () {
			var loadingModal = document.querySelector('.loading-modal');

			if (!loadingModal) { this.loading(); }
			this.createDragZone();
		}
	};

	return Imgur;
}));