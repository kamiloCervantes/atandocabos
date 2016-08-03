$(document).ready(function(){
	//create the slider
	$('.cd-testimonials-wrapper').flexslider({
		selector: ".cd-testimonials > li",
		animation: "slide",
		animationLoop: true,
		controlNav: false,
		directionNav: false,
		slideshow: true,
		smoothHeight: true,
		slideshowSpeed: 3000,
		animationSpeed: 700,
		start: function(){
			$('.cd-testimonials').children('li').css({
				'opacity': 1,
				'position': 'relative'
			});
		}
	});

	
});