<?php
$servername = "krithagroup.ipagemysql.com";
$username = "sridhar";
$password = "22441844";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "Connected successfully";
?>