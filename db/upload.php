<?
	// Ref: https://www.w3schools.com/php/php_mysql_create_table.asp

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

	// sql to create table
	$sql = "CREATE TABLE videos (
	id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
	title VARCHAR(30) NOT NULL,
	date VARCHAR(30),
	author VARCHAR(30),
	description VARCHAR(30),
	type VARCHAR(30),
	vid VARCHAR(255)
	)";

	if ($conn->query($sql) === TRUE) {
		echo "Table videos created successfully";
	} else {
		echo "Error creating table: " . $conn->error;
	}

	// $conn->close();

    // session_start();
	// require("connection.php");
	
	// Upload
    $title = mysql_real_escape_string($_POST['title']);
    $date = mysql_real_escape_string($_POST['date']);
    $author = mysql_real_escape_string($_POST['author']);
    $type = mysql_real_escape_string($_POST['type']);
    $description = mysql_real_escape_string($_POST['description']);
    $vidName = $_FILES['vid']['name'];
    $vidTmp = $_FILES['vid']['tmp_name'];
    $vidSize = $_FILES['vid']['size'];
    $maxFileSize = 2000000;
    $filePath = "uploads/videos/".$vidName;
    	move_uploaded_file($imgTmp, $filePath);
    	$query = sprintf("INSERT INTO videos(title, date, author, description, type, vid) VALUES ('%s', '%s', '%s', '%s', '%s', '%s')", $title, $date, $author, $description, $type, $filePath);
    	if(!mysql_query($query, $connect)) {
    	die(mysql_error());
    	} else {
    	echo("Choose a video!");
    	}
	?>
	
	<!DOCTYPE html>
<html>
<head>
<title>Image Upload</title>
<style type="text/css">
   #content{
   	width: 50%;
   	margin: 20px auto;
   	border: 1px solid #cbcbcb;
   }
   form{
   	width: 50%;
   	margin: 20px auto;
   }
   form div{
   	margin-top: 5px;
   }
   #img_div{
   	width: 80%;
   	padding: 5px;
   	margin: 15px auto;
   	border: 1px solid #cbcbcb;
   }
   #img_div:after{
   	content: "";
   	display: block;
   	clear: both;
   }
   img{
   	float: left;
   	margin: 5px;
   	width: 300px;
   	height: 140px;
   }
</style>
</head>
<body>
<div id="content">
  <?php
    while ($row = mysqli_fetch_array($result)) {
      echo "<div id='img_div'>";
      	echo "<img src='images/".$row['image']."' >";
      	echo "<p>".$row['image_text']."</p>";
      echo "</div>";
    }
  ?>
  <form method="POST" action="imageuploader.php" enctype="multipart/form-data">
  	<input type="hidden" name="size" value="1000000">
  	<div>
  	  <input type="file" name="image">
  	</div>
  	<div>
      <textarea 
      	id="text" 
      	cols="40" 
      	rows="4" 
      	name="image_text" 
      	placeholder="Say something about this image..."></textarea>
  	</div>
  	<div>
  		<button type="submit" name="upload">POST</button>
  	</div>
  </form>
</div>
</body>
</html>