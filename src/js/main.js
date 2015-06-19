/*eslint-env jquery */
var newsData = ( function() {
	"use strict";

	// start to fetch data immediately.
	// No need to wait for DOMContent
	var endpoints = {
		"uk-news": "http://content.guardianapis.com/search?q=uk%20news&api-key=test",
		football: "http://content.guardianapis.com/search?q=football&api-key=test",
		travel: "http://content.guardianapis.com/search?q=travel&api-key=test"
	};
	var futures = {};
	var streamHandler = function( response ) { return response.json(); };

	for ( var key in endpoints ) {
		futures[ key ] = fetch( endpoints[ key ] )
			.then( streamHandler );
	}

	return futures;
} )();

// using jquery just to speed up development.
// Not really necessary.
$( function() {
	"use strict";

	function onData( newsSection ) {
		var $newsList = $( "#" + newsSection + " ol" );

		newsData[ newsSection ].then( function( data ) {
			$newsList.empty();
			var news = data.response.results;

			for (var i = news.length - 1; i >= 0; i--) {
				// API doesn't return any trailText?
				$newsList.append( "<li><a href=\"" + news[i].webUrl + "\">" + news[i].webTitle + "</a></li>" );
			}
		} );
	}

	for ( var section in newsData ) {
		onData( section );
	}

	$( "body" )
		.on( "click", ".tabs_nav_item:not( .tabs_nav_item-selected )", function( evt ) {
			var $target = $( evt.target );
			var $pane = $( $target.attr( "href" ) );

			// don't bounce down
			evt.preventDefault();

			$( ".tabs_nav_item-selected" ).removeClass( "tabs_nav_item-selected" );
			$( ".tabs_panes_pane-selected" ).removeClass( "tabs_panes_pane-selected" );

			$target.closest( "li" ).addClass( "tabs_nav_item-selected" );
			$pane.addClass( "tabs_panes_pane-selected" );
		} );
} );
