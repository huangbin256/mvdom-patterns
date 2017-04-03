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


		// Note: As a scheduler.add/remoe example, here we add manually a schedule without a namespace, so, 
		//       we need to store the one created to remove it on .destroy
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
		
		// console.log("DashMainView.destroy", view.scheduleNs);

		// For the manual scheduler, we remove the schedule manually (other ones below will be removed by the scheduler-hook)
		scheduler.remove(view.scheduleNs);
	},


	// Note: For the other schedules, we use the application scheduler hook that will automatically create and remove 
	//       the schedules below on the view create and destroy
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