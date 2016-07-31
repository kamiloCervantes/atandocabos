// JavaScript Document
// Living Together Custom Scripts

$(document).ready( function(){
	var $container = $('.masonry');

    
        $container.masonry({
            itemSelector: '.post-box',
            columnWidth: '.post-box',
            transitionDuration: 0
        });
		
		$(function() {
    		$( "#tabs-que-hacemos" ).tabs({
      			collapsible: true,
				active: false,
				show: { effect: "slideDown", duration: 800, easing: "easeInOutCubic" },
				hide: { effect: "slideUp", duration: 600 }
    		});
			$( "#tabs-que-hemos-hecho" ).tabs({
      			collapsible: true,
				active: false,
				show: { effect: "slideDown", duration: 800, easing: "easeInOutCubic" },
				hide: { effect: "slideUp", duration: 600 }
    		});
  		});
		
		
		$(function() {
  $('.lt-btn-subir').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});
		
   
});

