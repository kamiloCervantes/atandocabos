// JavaScript Document
$(document).ready( function(){
		var offset = 220;
		var duration = 500;
		$(window).scroll(function() {
			if ($(this).scrollTop() > offset) {
				$('.lt-btn-subir').fadeIn(duration);
			} else {
				$('.lt-btn-subir').fadeOut(duration);
			}
		});
 
		$('.lt-btn-subir').click(function(event) {
			event.preventDefault();
			$('html, body').animate({scrollTop: 0}, duration);
			return false;
		});
});