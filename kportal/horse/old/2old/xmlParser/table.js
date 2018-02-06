$(document).ready(function(){
    $('.showHideBtn').click(function(e){
		// Show / Hide name change
        $(this).html($(this).html() == 'Show Only Favorite' ? 'Show All' : 'Show Only Favorite');
        
        e.preventDefault();
      
		// Toggle the class for getting different properties at run time ( show / hide)
		$('.optionalRow').toggleClass('hideRow favRow');			
    });
});

