<? ob_start(); ?>
<?php
// Inserting data with variable from HTML form - input.php

//database connection - localhost,root,password
$con = mysql_connect("sridharkritha.ipagemysql.com", "sridharkritha", "22441844");
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("contact"); // db name

$order="INSERT INTO emplogin (date, email, subject)
VALUES
(NOW(),'$_POST[email]','$_POST[subject]')";

//declare in the order variable
$result = mysql_query($order);	//order executes
if($result)
{
	echo("<br>Input data is succeed");
} 
else
{
	echo("<br>Input data is fail");
        die('Error: ' . mysql_error());
}

mysql_close($con);
header("Location: employee_login.php"); // going back to html form from php
?>
<? ob_flush(); ?>
