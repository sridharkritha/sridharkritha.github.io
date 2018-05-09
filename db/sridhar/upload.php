<?php
// Connection - start
// Ref: https://www.w3schools.com/php/php_mysql_insert.asp

// session_start();
// require("connection.php");
$servername = "krithagroup.ipagemysql.com";
$username = "sridhar";
$password = "22441844";
$dbname = "derby";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// $conn->close();
// Connection - end

//turn on php error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	
	$name     = $_FILES['file']['name'];
	$tmpName  = $_FILES['file']['tmp_name'];
	$error    = $_FILES['file']['error'];
	$size     = $_FILES['file']['size'];
    $ext	  = strtolower(pathinfo($name, PATHINFO_EXTENSION));
  
	switch ($error) {
		case UPLOAD_ERR_OK:
			$valid = true;
			//validate file extensions
			if ( !in_array($ext, array('jpg','jpeg','png','gif')) ) {
				$valid = false;
				$response = 'Invalid file extension.';
			}
			//validate file size
			if ( $size/1024/1024 > 2 ) {
				$valid = false;
				$response = 'File size is exceeding maximum allowed size.';
			}
			//upload file
			if ($valid) {
				$targetPath =  dirname( __FILE__ ) . DIRECTORY_SEPARATOR. 'uploads' . DIRECTORY_SEPARATOR. $name;
				move_uploaded_file($tmpName,$targetPath);

				// MySQL Update - start
				// Get text
				$fileDescription = mysqli_real_escape_string($dbname, $_POST['fileDescription']);
				// $fileDescription = mysql_real_escape_string($_POST['fileDescription']); 
				$filePath = "uploads/".$name;
				
	  
				$sql =  sprintf("INSERT INTO photoTable (fileDescription, filePath) VALUES ('%s', '%s')", $fileDescription, $filePath);
				// $sql = "INSERT INTO photoTable (fileDescription, filePath) VALUES ('John', 'Doe')";
				if ($conn->query($sql) === TRUE) {
					echo "New record created successfully";
				} else {
					echo "Error: " . $sql . "<br>" . $conn->error;
				}
				// MySQL Update - end

				header( 'Location: index.php' ) ;
				exit;
			}
			break;
		case UPLOAD_ERR_INI_SIZE:
			$response = 'The uploaded file exceeds the upload_max_filesize directive in php.ini.';
			break;
		case UPLOAD_ERR_PARTIAL:
			$response = 'The uploaded file was only partially uploaded.';
			break;
		case UPLOAD_ERR_NO_FILE:
			$response = 'No file was uploaded.';
			break;
		case UPLOAD_ERR_NO_TMP_DIR:
			$response = 'Missing a temporary folder. Introduced in PHP 4.3.10 and PHP 5.0.3.';
			break;
		case UPLOAD_ERR_CANT_WRITE:
			$response = 'Failed to write file to disk. Introduced in PHP 5.1.0.';
			break;
		default:
			$response = 'Unknown error';
		break;
	}

	echo $response;
}
?>