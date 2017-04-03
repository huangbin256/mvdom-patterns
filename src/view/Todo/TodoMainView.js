var d = mvdom; // external/global lib
var render = require("../../js-app/render.js").render;


d.register("TodoMainView",{
	create: function(data, config){
		return render("TodoMainView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first. 
	}, 

	hubEvents: {
		"routeHub; CHANGE": function(routeInfo){				
		}
	}

});