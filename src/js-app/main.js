var d = mvdom; // external lib
var route = require("./route.js");

/**
 * This module do not externalize anything, but just start the application. We put it on DOMContentLoader (i.e. $.ready for modern browsers)
 **/ 

document.addEventListener("DOMContentLoaded", function(event) {
	var bodyEl = d.first("body");

	// first make sure we empty eventual body.
	d.empty(bodyEl);

	// then add this new MainView
	d.display("MainView", bodyEl).then(function(){

		// initialize the route, which will trigger a "CHANGE" on the routeHub hub. 
		// Note: we do that once the MainView has been added to the DOM so that it can react accordingly
		route.init();
	});


});
