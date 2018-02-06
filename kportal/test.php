<script type="text/javascript" src="jquery.js"></script>

<script type="text/javascript">

// set constants
var $pageheight = 189; // our single page height
var $pagewidth = 146; // our single page width

var $pageYpos = 0; // current Y position of our bg-image (in both pages)

$(document).ready(function(){ // When the page is ready

/* left page turner */
$("#leftpage").click( function() {
$pageYpos = $pageYpos + $pageheight; // update Y postion
$("#leftpage").css("background-position", "0px "+$pageYpos+"px");// move the background position

setTimeout ('$("#flip").css("background-position", "top center");', 200);
setTimeout ('$("#rightpage").css("background-position", "146px "+$pageYpos+"px");', 200);

}); // close leftpage click function

/* right page turner */
$("#rightpage").click( function() {
$pageYpos = $pageYpos - $pageheight; // note: minus page height
$("#rightpage")
.css("background-position", "0px "+$pageYpos+"px");

$("#flip").css("background-position", "top left");
setTimeout ('$("#flip").css("background-position", "top center");', 200);
setTimeout ('$("#leftpage").css("background-position", "146px "+$pageYpos+"px");', 200);

}); // close rightpage click function
}); // close doc ready

</script>

