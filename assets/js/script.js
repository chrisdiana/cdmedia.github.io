/*         __         _             ___
 *   _____/ /_  _____(_)____   ____/ (_)___ _____  ____ _
 *  / ___/ __ \/ ___/ / ___/  / __  / / __ `/ __ \/ __ `/
 * / /__/ / / / /  / (__  )  / /_/ / / /_/ / / / / /_/ /
 * \___/_/ /_/_/  /_/____/   \__,_/_/\__,_/_/ /_/\__,_/
 *
 * Chris Diana | chrisdianamedia.com | github.com/cdmedia
 */
(function() {

    // Navigation
    $('.toggle').click(function() {
        $('#navicon').toggleClass('active');
        $('#overlay').toggleClass('open');
    });

    // Particles
    $('#particles').particleground({
        dotColor: '#444444',
        density: 10000,
        proximity: 250,
        lineColor: '#444444'
    });

    // Portfolio
    $('#portfolio-gallery').mixItUp({
        animation: {
            duration: 220,
            effects: 'fade stagger(34ms) translateZ(-40px)',
            easing: 'ease'
        }
    });

    // Featherlight settings
    $.featherlight.contentFilters.iframe = {
        process: function(url){
            return $('<iframe width="800" height="500" src="' + url + '"/>');
        }
    };

})();
