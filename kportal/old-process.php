 <?php 
$name="$_POST['author']";
$email="$_POST['email']";
$subject="$_POST['subject']";
$text="$_POST['text']";
echo "your name is".$name."""and you are".$email.

$link = mysql_connect('krithagroupcom.ipagemysql.com', 'sridharkritha', '22441844'); 
if (!$link) { 
    die('Could not connect: ' . mysql_error()); 
} 
echo 'Connected successfully'; 
mysql_select_db(contact); 


$query="INSERT INTO Customer(Name, Email, Subject, Message)Values(.$name.$email.$subject.$text)";
$result=mysql_query("$link","$query") or die("Could not execute");
mysql_close=("$link");

?>
