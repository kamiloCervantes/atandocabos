$(document).ready( function(){
	
	var $container = $('.masonry');
    
        $container.masonry({
            itemSelector: '.post-box',
            columnWidth: '.post-box',
            transitionDuration: 0
        });
});

