$(function() {

	SimpleJekyllSearch.init({
		searchInput: document.getElementById('search-input'),
		resultsContainer: document.getElementById('results-container'),
		dataSource: "/search.json",
		template: "<a href='{url}' title='{desc}'>{title}</a>",
		fuzzy: true
	});

	var triggerBttn = document.getElementById( 'trigger-overlay' ),
		overlay = document.querySelector( 'div.overlay' ),
		closeBttn = overlay.querySelector( 'button.overlay-close' );
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		support = { transitions : Modernizr.csstransitions };

	function toggleOverlay() {
		if( classie.has( overlay, 'open' ) ) {
			jQuery('.search-icon').show();
			classie.remove( overlay, 'open' );
			classie.add( overlay, 'close' );
			var onEndTransitionFn = function( ev ) {
				if( support.transitions ) {
					if( ev.propertyName !== 'visibility' ) return;
					this.removeEventListener( transEndEventName, onEndTransitionFn );
				}
				classie.remove( overlay, 'close' );
			};
			if( support.transitions ) {
				overlay.addEventListener( transEndEventName, onEndTransitionFn );
			}
			else {
				onEndTransitionFn();
			}
		}
		else if( !classie.has( overlay, 'close' ) ) {
			classie.add( overlay, 'open' );
			jQuery('.search-icon').hide();
			jQuery('#search-input').focus();
		}
	}

	triggerBttn.addEventListener( 'click', toggleOverlay );
	closeBttn.addEventListener( 'click', toggleOverlay );

	jQuery(document).keyup(function(e) {
  		if (e.keyCode == 27) {
  			toggleOverlay();
  		}
	});

	jQuery("#menu-toggle").click(function () {
        if (jQuery("#sidebar-nav").hasClass("slideup"))
            jQuery("#sidebar-nav").removeClass("slideup").addClass("slidedown");
        else
            jQuery("#sidebar-nav").removeClass("slidedown").addClass("slideup");
    });

    jQuery('#portfolio-gallery').mixItUp({
		animation: {
			duration: 220,
			effects: 'fade stagger(34ms) translateZ(-40px)',
			easing: 'ease'
		}
	});

	$.featherlight.contentFilters.iframe = {
           process: function(url){
               return $('<iframe width="800" height="500" src="' + url + '"/>')
           }
       }
});
