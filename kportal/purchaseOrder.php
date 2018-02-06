

<?php include_once($_SERVER['DOCUMENT_ROOT']  . '/header.php'); ?>
<!-- ----------------END of Header Include------------------------------ -->
<link rel="stylesheet" type="text/css" href="css/style-purchasOrder.css" />



	<div id="page-wrap">

		<textarea id="header">:: PURCHASE ORDER ::</textarea>
		
		<div id="identity">
		
            <textarea id="address"> Pls Click and Type your
:: COMPANY NAME ::
:: COMPANY FULL ADDRESS ::
:: TELEPHONE NO ::
:: EMAIL ID ::
:: CONTACT PERSON NAME ::
</textarea>

            <div id="logo">

              <div id="logoctr">
                <a href="javascript:;" id="change-logo" title="Change logo">Change Logo</a>
                <a href="javascript:;" id="save-logo" title="Save changes">Save</a>
                |
                <a href="javascript:;" id="delete-logo" title="Delete logo">Delete Logo</a>
                <a href="javascript:;" id="cancel-logo" title="Cancel changes">Cancel</a>
              </div>

              <div id="logohelp">
                <input id="imageloc" type="text" size="50" value="" /><br />
                (max width: 540px, max height: 100px)
              </div>
              <img id="image" src="images/customerLogo.png" alt="Customer Logo" />
            </div>
		
		</div>
		
		<div style="clear:both"></div>
		
		<div id="customer">
            <table id="meta">
                <tr>
                    <td class="meta-head">Purchase Order to Kritha Group #</td>
                    <td><textarea>0000</textarea></td>
                </tr>
                <tr>

                    <td class="meta-head">Date</td>
                    <td><textarea id="date">December 15, 2009</textarea></td>
                </tr>
                <tr>
                    <td class="meta-head">Amount Due</td>
                    <td><div class="due">Rs. 0.00</div></td>
                </tr>

            </table>
		
		</div>
		
		<table id="items">
		
		  <tr>
		      <th>Item</th>
		      <th>Description</th>
		      <th>Unit Cost</th>
		      <th>Quantity</th>
		      <th>Price</th>
		  </tr>
		  
		  <tr class="item-row">
		      <td class="item-name"><div class="delete-wpr"><textarea>::TYPE- item detail ::</textarea><a class="delete" href="javascript:;" title="Remove row">X</a></div></td>
		      <td class="description"><textarea>:: TYPE- item description ::</textarea></td>
		      <td><textarea class="cost">Rs. 0.00</textarea></td>
		      <td><textarea class="qty">0</textarea></td>
		      <td><span class="price">Rs. 0.00</span></td>
		  </tr>
		  
		  <tr class="item-row">
		      <td class="item-name"><div class="delete-wpr"><textarea>::TYPE- item detail ::</textarea><a class="delete" href="javascript:;" title="Remove row">X</a></div></td>

		      <td class="description"><textarea>:: TYPE- item description ::</textarea></td>
		      <td><textarea class="cost">Rs. 0.00</textarea></td>
		      <td><textarea class="qty">0</textarea></td>
		      <td><span class="price">Rs. 0.00</span></td>
		  </tr>
		  
		  <tr id="hiderow">
		    <td colspan="5"><a id="addrow" href="javascript:;" title="Add a row">Add a new item</a></td>
		  </tr>	
		  <tr>
		      <td colspan="2" class="blank"> </td>
		      <td colspan="2" class="total-line">Amount Paid</td>

		      <td class="total-value"><textarea id="paid">RS. 0.00</textarea></td>
		  </tr>
		  <tr>
		      <td colspan="2" class="blank"> </td>
		      <td colspan="2" class="total-line balance">Balance Due</td>
		      <td class="total-value balance"><div class="due">Rs. 0.00</div></td>
		  </tr>
		
		</table>
		
		<div id="terms">
		  <h5>Terms and Conditions / Other Information</h5>
		  <textarea>:: Please TYPE your company terms and conditions if any related to this purchase order ::  </textarea>
<b>
Once order is recieved from our side. We will contact you either by phone or by person to get confirmation from your concern about the above given purchase order and price details - KRITHA GROUP. 
</b>
		</div>
	
	</div>
	
<!-- ----------------Beginning of Footer Include------------------------ -->
<?php include_once($_SERVER['DOCUMENT_ROOT']  . '/footer.php'); ?>
