var d = mvdom; // external/global lib
var render = require("../js-app/render.js").render;
var utils = require("../js-app/utils.js");

var pathToView = {
	"": "HomeView", 
	"todo": "TodoMainView", 
	"dash": "DashMainView"
};


d.register("MainView",{
	create: function(data, config){
		return render("MainView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first. 
	}, 

	hubEvents: {
		"routeHub; CHANGE": function(routeInfo){				
			displayView.call(this, routeInfo);
		}
	}

});



// --------- Private Methods --------- //

function displayView(routeInfo){
	var view = this;

	var path0 = routeInfo.pathAt(0);

	// if null or undefined, make it empty string.
	path0 = (!path0)?"":path0;

	// select the nav
	var navEl = d.first(view.el, ".main-nav");
	d.all(navEl,"a.active").forEach(function(itemEl){
		itemEl.classList.remove("active");
	});
	
	var activeEl = d.first(navEl,"[href='#" + path0 + "']");
	if (activeEl){
		activeEl.classList.add("active");
	}

	

	var subViewName = pathToView[path0];



	// display the view (empty first)
	var contentEl = d.first(view.el, ".main-content");
	d.empty(contentEl);
	d.display(subViewName, contentEl);
	
}

// --------- /Private Methods --------- //