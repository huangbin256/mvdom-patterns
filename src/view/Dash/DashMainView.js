var d = mvdom; // external/global lib
var render = require("../../js-app/render.js").render;
var ajax = require("../../js-app/ajax.js");
var scheduler = require("../../js-app/scheduler.js");


d.register("DashMainView",{
	create: function(data, config){
		return render("DashMainView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first. 


		// Add the first schedule with the  scheduler directly with the scheduler.add 
		// Note 1: Here we add manually a schedule without a namespace, so, 
		//         we need to store the one created to remove it on .destroy
		// Important: The recommended way for view is to use the view.schedules below which is enabled by scheduler-hook.js.
		view.scheduleNs = scheduler.add({
			performFn: function(){
				return ajax.get("/api/cpuUsage");
			}, 
			receiveFn: function(data){
				var view = this;
				var lastMeasure = data[data.length - 1];
				d.push(d.first(view.el, ".cpu-card"), lastMeasure);				
			}, 
			ctx: view
		});		
	},

	destroy: function(){
		var view = this;
		
		// For the manual scheduler, we must remove the schedule manually.
		scheduler.remove(view.scheduleNs);
	},



	// RECOMMENDED: Here we add the other schedule the view.schedules way which is managed by the scheduler-hook.js. 
	//              Those schedules will be added when the view get created and removed when the view is removed.
	schedules: [{
		performFn: function(){
			return ajax.get("/api/memUsage");
		},

		receiveFn: function(data){
			var view = this;
			var lastMeasure = data[data.length - 1];
			d.push(d.first(view.el, ".mem-card"), lastMeasure);					
		}
	}]


});