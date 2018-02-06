<!DOCTYPE html>
<html>
<body>

<?php
/*
$str = "Learn PHP";
$x = 5; $y = 4;
echo "<h2>" . $str . "</h2>";
echo $x + $y;
echo "Hello world!";
*/
// Read the data from some web page
set_time_limit(0);
// initialize a new resource
$ch = curl_init();
// set the url to fetch
//$url = 'http://www.krithagroup.com/horse/examples/hbook.xml';
//$url = 'http://www.krithagroup.com/horse/examples/input.html';
$url = 'http://xml.betdaq.com/uk/horseracing';
//$url = 'http://localhost/examples/simple.xml';
//$url = 'http://localhost/examples/input.html';
//$url = 'http://localhost/examples/hbook.xml';


curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_FAILONERROR,1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION,1);
// don't give me the headers just the content
//curl_setopt($ch, CURLOPT_HEADER, false);
// return the value instead of printing the response to browser
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
# Only if you need to bypass SSL certificate validation
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
//$timeout = 5;
//curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
curl_setopt($ch, CURLOPT_TIMEOUT, -1); # optional: -1 = unlimited, 3600 = 1 hour


//Downloading the remote file by copying into a temp file
$fp = fopen (dirname(__FILE__) . '/localfile.tmp', 'w+');
// write curl response to file
curl_setopt($ch, CURLOPT_FILE, $fp); 


# Exceute the download
$data = curl_exec($ch);
// print all 
//echo "$data";

/*
// Print by elements
$xml = simplexml_load_string($data);
foreach($xml as $xmlEntry)
{
echo $xmlEntry->name . "\n";
echo $xmlEntry->price . "\n";
echo $xmlEntry->description . "\n";
echo $xmlEntry->calories . "\n";
}
*/

curl_close($ch);


?>

</body>
</html>