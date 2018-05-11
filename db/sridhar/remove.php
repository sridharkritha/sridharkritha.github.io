<?php
// get correct file path
$fileName = $_GET['name'];
$filePath = 'uploads/'.$fileName;
// remove file if it exists
if ( file_exists($filePath) )
{
	// Delete the image description from MySQL
	// $sql =  sprintf("DELETE FROM photoTable WHERE filePath = '%s'", $filePath);
	$sql = "DELETE FROM photoTable WHERE filePath= 'uploads/3.png'";

	if ($conn->query($sql) === TRUE)
	{
		echo "record deleted successfully";
	}
	else
	{
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
	
	// Delete the image file from the remote folder
	unlink($filePath);
	header('Location:index.php');
	
}
?>