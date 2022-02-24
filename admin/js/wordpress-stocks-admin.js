(function( $ ) {
	'use strict';

    jQuery(document).ready(function() {
        var unsplashPage = $('#unsplash');
        if(unsplashPage.length > 0) {
            unsplash.init(wordpress_stocks_options);
        }

        var pexelsPage = $('#pexels');
        if(pexelsPage.length > 0) {
            pexels.init(wordpress_stocks_options);
        }

        var foodshotPage = $('#foodshot');
        if(foodshotPage.length > 0) {
            foodshot.init(wordpress_stocks_options);
        }

        var pixabayPage = $('#pixabay');
        if(pixabayPage.length > 0) {
            pixabay.init(wordpress_stocks_options);
        }
    });

})( jQuery );
