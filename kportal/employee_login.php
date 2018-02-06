<?php include_once($_SERVER['DOCUMENT_ROOT']  . '/header.php'); ?>
<!-- ----------------END of Header Include------------------------------ -->
 <div class="cleaner h40"></div>
 <div class="cleaner h40"></div>

    <div id="employee_login_main">
    	
       <h2>Employee Login</h2>
        <div class="half float_l">
			
            <div id="contact_form">
				<form method="post" name="contact" action="eLoginChecker.php">
					
												
					<label for="email"><p>User Name:</p></label> <input type="text" class="validate-email required input_field" name="email" id="email" />
					<div class="cleaner h10"></div>
															
					<label for="subject"><p>Password:</p></label> <input type="password" class="validate-subject required input_field" name="subject" id="subject"/>				               
					<div class="cleaner h10"></div>							
																
					<input type="submit" value="Login" id="submit" name="submit" class="submit_btn float_l" />
										
				</form>
            </div>
		</div>
        
        
        <div class="cleaner h40"></div>




        
    
    	<div class="cleaner"></div>
    
    </div> <!-- END of main -->
    
</div> <!-- END of wrapper -->
 <div class="cleaner h40"></div>
 <div class="cleaner h40"></div>
 <div class="cleaner h40"></div>
<!-- ----------------Beginning of Footer Include------------------------ -->
<?php include_once($_SERVER['DOCUMENT_ROOT']  . '/footer.php'); ?>
