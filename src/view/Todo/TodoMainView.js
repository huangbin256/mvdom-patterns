var d = mvdom; // external/global lib
var render = require("../../js-app/render.js").render;
var utils = require("../../js-app/utils.js");


d.register("TodoMainView",{
	create: function(data, config){
		return render("TodoMainView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first. 

		var arr = [{ pid: '21670', cpu: '0.0', command: 'LookupViewServic' }, 
								{ pid: '111', cpu: '3.3', command: 'Three' }];
		var dic = utils.dic(arr, "pid");
		console.log(dic);
		console.log(dic["111"]);
	}, 

	hubEvents: {
		"routeHub; CHANGE": function(routeInfo){				
		}
	}

});