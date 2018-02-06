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

$order="INSERT INTO customer (date, author, email, subject, text)
VALUES
(NOW(),'$_POST[author]','$_POST[email]','$_POST[subject]','$_POST[text]')";

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
header("Location: contact.php"); // going back to html form from php
?>
<? ob_flush(); ?>
