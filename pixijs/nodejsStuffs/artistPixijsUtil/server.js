// Ref: https://www.codedodle.com/2016/10/nodejs-image-uploader-using-express-and.html
// https://github.com/tamilps2/ajax-image-upload-with-node-js

var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	formidable = require('formidable'),
	readChunk = require('read-chunk'),
	fileType = require('file-type');

var app = express();

app.set('port', (process.env.PORT || 5000));

// Tell express to serve static files from the following directories
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


var sessionDirectoryName = null;


/**
 * Index route
 */
app.get('/delete_photos', function (req, res) {
	
	deleteOldFiles();
});

/**
 * Index route
 */
app.get('/', function (req, res) {
	/*
	// Don't bother about this :)
	var filesPath = path.join(__dirname, sessionDirectoryName);
	fs.readdir(filesPath, function (err, files) {
		if (err) {
			console.log(err);
			return;
		}

		files.forEach(function (file) {
			fs.stat(filesPath + file, function (err, stats) {
				if (err) {
					console.log(err);
					return;
				}

				var createdAt = Date.parse(stats.ctime),
					days = Math.round((Date.now() - createdAt) / (1000 * 60 * 60 * 24));

				if (days > 1) {
					fs.unlink(filesPath + file); // delete 1 day old files
				}
			});
		});
	});
*/
	res.sendFile(path.join(__dirname, 'views/index.html'));

	//deleteOldFiles();

	// create a new directory for each new session for refresh/users
	sessionDirectoryName = 'uploads/'+ Date.now() + '/';
	fs.mkdirSync(sessionDirectoryName);
});

/**
 * Upload photos route.
 */
app.post('/upload_photos', function (req, res) {
	var photos = [],
		form = new formidable.IncomingForm();

	// Tells formidable that there will be multiple files sent.
	form.multiples = true;
	// Upload directory for the images
	form.uploadDir = path.join(__dirname, 'tmp_uploads');

	// Invoked when a file has finished uploading.
	form.on('file', function (name, file) {
		// Allow only 10 files to be uploaded.
		if (photos.length === 10) {
			fs.unlink(file.path);
			return true;
		}

		var buffer = null,
			type = null,
			filename = '';

		buffer = readChunk.sync(file.path, 0, 262);
		type = fileType(buffer);

		// Check the file type, must be either png,jpg or jpeg
		// if (type !== null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'jpeg' || type.ext === 'json' || type.ext === 'atlas')) {
		if(1)	{


		// Assign new file name
			// filename = Date.now() + '-' + file.name;
			filename = file.name;

			// Move the file with the new file name
			fs.rename(file.path, path.join(__dirname, sessionDirectoryName + filename));

			// Add to the list of photos
			photos.push({
				status: true,
				filename: filename,
				// type:  type.ext,
				publicPath: sessionDirectoryName + filename    // 'uploads/'
			});
		} else {
			photos.push({
				status: false,
				filename: file.name,
				message: 'Invalid file type'
			});
			fs.unlink(file.path);
		}
	});

	form.on('error', function (err) {
		console.log('Error occurred during processing - ' + err);
	});

	// Invoked when all the fields have been processed.
	form.on('end', function () {
		console.log('All the request fields have been processed.');
	});

	// Parse the incoming form fields.
	form.parse(req, function (err, fields, files) {
		res.status(200).json(photos);
	});
});

app.listen(app.get('port'), function () {
	console.log('Express started at port ' + app.get('port'));
});



// Delete the files inside the upload folder
function deleteOldFiles() {
	var files = fs.readdirSync('./uploads');
	for( var i = 0, n = files.length; i < n; ++i) {
		var fullPath = './uploads/' + files[i];
		if (fs.statSync(fullPath).isDirectory()){
			// fs.rmdir(fullPath, function (err) {
			// 	if (err) throw err;
			// 		// if no error, folder has been deleted successfully
			// 		console.log('Folder deleted!');
			// });
		} else {
			// delete file named 'sample.txt'
			fs.unlink(fullPath, function (err) {
				if (err) throw err;
				// if no error, file has been deleted successfully
				console.log('File deleted!');
			});
		}
	}
}



