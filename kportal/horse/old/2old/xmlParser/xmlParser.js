
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
Flashing Table Border Script- (c) Dynamic Drive (www.dynamicdrive.com)
Visit http://www.dynamicdrive.com for this script
Credit must stay intact for use
*/

//configure interval btw flash (1000=1 second)
var speed=500
var flashRowIds = []; // ["rowOne","rowThree"];
var flashIndex = 0;
function flashit()
{
while(flashIndex < flashRowIds.length + 1)
{
var crosstable=document.getElementById? document.getElementById(flashRowIds[flashIndex]) : document.all? document.all.myexample : ""
if (crosstable){
if (crosstable.style.borderColor.indexOf("green")!=-1)
crosstable.style.borderColor="red"
else
crosstable.style.borderColor="green"
}
++flashIndex;
}
flashIndex  = 0;
}

setInterval("flashit()", speed)





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $(document).ready(function () {	
	
    	//$("#dvContent").append("<ul></ul>");
    	$.ajax({
    		type : "GET",
    		url : "hbook.xml",
    		dataType : "xml",
    		success : function (xml) 
			{
    			/*
    			<SPORT NAME="Horse Racing" ID="100004">
    			<EVENT NAME="UK Racing" ID="190538">
    			<SUBEVENT NAME="Huntingdon (30th May 2016)" ID="3076648" DATE="2016-05-30 00:01:00">
    			<SUBEVENT1 NAME="14:00 Huntingdon" ID="3076652" DATE="2016-05-30 14:00:00">
    			 */
    			/*
    			var horseName = $(xml).find('SELECTION').attr('NAME');
    			alert(horseName);

    			var price = $(xml).find('PRICE').attr('VALUE');
    			alert(price);
    			//-----------------------------------------------------------------------
    			$(xml).find('SELECTION').each(function(){
    			var horseName = $(this).attr('NAME');
    			var price = $(this).find('PRICE').attr('VALUE');

    			$("<li></li>").html(horseName + ", " + price).appendTo("#dvContent ul");
    			 */

    			$(xml).find('root').each(function () 
				{
					flashRowIds = [];
    				////////////////////////////////////////////////////////////////////////
    				// Sports Name & Sports Region
    				// (Horse Racing & UK Racing)
    				//$(xml).find('SPORT').each(function(){
    				$(this).find('SPORT').each(function ()
					{
    					var sportsName = $(this).attr('NAME');
    					// Skip sports other than horse race
    					if ('Horse Racing' == sportsName) 
						{
    						/////////////////////////////////////////////////////////////////////////////////////
    						var eventName = $(this).find('EVENT').attr('NAME');
    						// Skip other region or country races other than UK and Irish
    						if ('UK Racing' == eventName || 'Irish Racing' == eventName)
							{
    							//Add the data rows.								
    							tr = $('<tr/>');
    							tr.append("<td>" + sportsName + "</td>");
    							tr.append("<td>" + eventName + "</td>");
    							$('.HorseTable').append(tr);
    							// $("<li></li>").html(sportsName + ", " + eventName).appendTo("#dvContent ul");
    							// $("<li></li>").html("************************************************************").appendTo("#dvContent ul");

    							///////////////////////////////////////////////////////////////////////
    							// Race Course Name & Date
    							// (14:00 Huntingdon & 2016-05-30 14:00:00)
    							// var raceCourse = $(this).find('SUBEVENT1').attr('NAME');
    							$(this).find('SUBEVENT1').each(function () 
								{
    								//$("<hr>").html("").appendTo("#dvContent ul");
    								var raceCourse = $(this).attr('NAME');
    								var date = $(this).attr('DATE'); // 2016-05-30 14:00:00
									var dateTimeAry = date.trim().split(' '); 								
									date = dateTimeAry[0]; // 2016-05-30	
																
									//Add the data rows ( Space ).								
									tr = $('<tr/>');
									tr.append('<td style="height:70px">' + "" + '</td>');	
									tr.append('<td style="height:70px">' + "" + '</td>');	
									$('.HorseTable').append(tr);								

    								//Add the data rows.
    								tr = $('<tr/>');									
    								tr.append('<td style="font-weight: bold">' + raceCourse + '</td>');	
									tr.append('<td style="font-weight: bold">' + date + '</td>');	            								
									$('.HorseTable').append(tr);
    								//$("<li></li>").html(raceCourse + ", " + date).appendTo("#dvContent ul");
    								//$("<hr>").html("").appendTo("#dvContent ul");

    								///////////////////////////////////////////////////////////
    								// <MARKET NAME="Win Market" ID="7606449" ODDS_SYSTEM="BL">
    								$(this).find('MARKET').each(function () 
									{
    									if ('Win Market' == $(this).attr('NAME')) 
										{
    										////////////////////////////////////////////////////////////
    										var horseObjAry;
    										horseObjAry = [];
    										var hName,
    										hPrice;
    										var idx = 0;
    										hName = [];
    										hPrice = [];
    										// Horse Name & Price
    										// (7 Star Trouper & 2.64)
    										$(this).find('SELECTION').each(function ()
											{
    											var ponyName = $(this).attr('NAME');

    											var price = 0.0;
    											// Price tag is optional so check price tag is exist or not
    											if ($(this).find('PRICE').length) 
												{
    												price = $(this).find('PRICE').attr('VALUE').trim();
    											}

    											var tempAry = ponyName.trim().split(' ');
    											// Horse Number is optional
    											// Check is a number or string (acceptable number form(integer/float): 5, 6.7; Not acceptable number form(number and string combined): 5Rockey )
    											// Note: parseInt(tempAry[0], 10) => may consider '5Rockey' is a integer not a string
    											if (Math.floor(tempAry[0]) === Math.floor(tempAry[0])) 
												{
    												idx = tempAry[0];
    											} else {
    												idx += 1;
    											}

    											hName[idx] = ponyName;
    											if (hPrice[idx] == null)
    												hPrice[idx] = price;
    											else if (parseFloat(price) > 0 && parseFloat(hPrice[idx]) > parseFloat(price))
    												hPrice[idx] = price;

    											// else hPrice[tempAry[0]] = 0.0;

    											// Create Array of horse OBJECTS
    											horseObjAry.push({
    												horseNumber : idx,
    												horseName : ponyName,
    												horsePrice : price
    											});

    											// $("<li></li>").html(ponyName + ", " + price).appendTo("#dvContent ul");
    										}); // Horse Name & Price
    										//$("<hr>").html("").appendTo("#dvContent ul");

    										/*
    										// Print the Horses full list ( values in an Array)
    										for(var i=1;i<hName.length;i++)
    									    {
    										if(hName[i] != null)
    										$("<li></li>").html(hName[i] + ", " + hPrice[i]).appendTo("#dvContent ul");
    										}
    										*/

    										// Sort by descending order
    										horseObjAry.sort(function (a, b) {
    											return parseFloat(b.horsePrice) - parseFloat(a.horsePrice);
    										});

											var idx = 0;
    										// Print the Horses full list ( OBJECTS in an Array )
    										for (var i = 0; i < horseObjAry.length; i++) 
											{
    											//$("<li></li>").html(horseObjAry[i].horseName + ", " + horseObjAry[i].horsePrice).appendTo("#dvContent ul");
												
												// Label : Horse Name & Price 
												if(i ==0)
												{											
												    //Add the data rows.
													tr = $('<tr/>');
													tr.append("<td>" + "Horse Name" + "</td>");
													tr.append("<td>" + "Price" + "</td>");
													//tr.append('<td id="myexample" style="border:5px solid green">' + "Price" + "</td>");
													$('.HorseTable').append(tr);
												}			
												
												var bgColour = ["#cc9900","#ff5733","#c70039","#900c3f","#581845",
												                "#043227","#097168","#cc7400","#fa482e","#009973",
                                                                "#7aa12b","#e55915","#2283a4","#605f5d","#704241",
																"#000033","#660000","#333333","#003300","#d3003f"];
												var fontColour = ["white","#550000"];											
												
												var bgColourStr = "background-color:" + bgColour[idx];												
												var fontColourStr = "color:" + fontColour[0];
												++idx;
												if(bgColourStr.length - 1 < idx) idx = 0;
												
												//var bgColourStr = "background-color:" + "#ffff42";												
												//var fontColourStr = "color:" + "#550000";											
												
												//Add the data rows.
												if(i < 3)
												{
													tr = $('<tr/ class="favRow">');	  // Rows always visible													
												}	
                                                else  tr = $('<tr/ class="optionalRow">');	  // Rows visibility is optional and controlled by a button (show / hide)
												
                                                if(i == 0)
												{	
                                                  // Blinking table row border	
                                                  // <td id="myexample" style="border:5px solid green">row two</td>	

												  var flashId = horseObjAry[i].horseName;

                                                  flashRowIds.push(flashId);
												  
												  var flashIdStr = ' id="' + flashId + '" '; // id="myexample"
												  
												  var styleStr = '<td' + flashIdStr + 'style="border:10px solid green; cellpadding: 14px; ' + bgColourStr +';'+ fontColourStr + '">';													
											
												  
                                                 // var styleStr = '<td id="myexample" style="border:10px solid green;' + bgColourStr +';'+ fontColourStr + '">';													
												}
												else
												{
													var styleStr = '<td style="' + bgColourStr +';'+ fontColourStr + '">';
												}
													
												/*	
												if(i == 3)
												{
													
													// Add a (Show/Hide)Button 
													tr.append(styleStr + " " + '</td>');
													// tr.append(styleStr + " " + '</td>');
													
													//tr.append('<td><button class="editbtn"> edit</button></td>');
													tr.append('<td><button class="editbtn">edit</button></td>');
													
													// <tr><td><button class="editbtn">edit</button></td></tr>
													
													 
													// tr.append('<td> <button class="editbtn">' + edit + '</button> </td>');
												    
												}
												*/
                                               													
												tr.append(styleStr + horseObjAry[i].horseName + '</td>');

                                                // var styleStr = '<td style="background-color: #ffff42;color:#550000">';
    											// tr.append('<td style="background-color: #ffff42;color:#550000">' + horseObjAry[i].horseName + '</td>');
    											// tr.append("<td>" + horseObjAry[i].horseName + "</td>");
												
    											tr.append("<td>" + horseObjAry[i].horsePrice + "</td>");												
    											$('.HorseTable').append(tr);
    										}
    									}
    									////////////////////////////////////////////////////////////
    								}); // Win Market
    							}); // Race Course Name &p Date
    						} // is Foreign country races ?
    					} // is horse racing ?
    				}); // Sports Name & Sports Region
    			}); // root

    			/*
    			var currLoanXml = '<company sample="text"><employee id="001" sex="M" age="20">Premshree Pillai</employee></company>';
    			var pic = $(currLoanXml).filter('company').attr('sample');
    			alert(pic);

    			var sample = $(currLoanXml).attr('sample');
    			alert(sample);

    			var pic = $(currLoanXml).find('employee').attr('id');
    			alert(pic);
    			//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    			$(xml).find('Book').each(function(){
    			var sTitle = $(this).find('Title').text();
    			var sPublisher = $(this).find('Publisher').text();
    			$("<li></li>").html(sTitle + ", " + sPublisher).appendTo("#dvContent ul");
    			});
    			 */
    		},
    		error : function () {
    			alert("An error occurred while processing XML file.");
    		}
    	});
    });
   