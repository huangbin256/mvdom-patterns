var d = mvdom; // external/global lib
var render = require("../../js-app/render.js").render;
var ajax = require("../../js-app/ajax.js");
var scheduler = require("../../js-app/scheduler.js");
var utils = require("../../js-app/utils.js");

// --------- View Controller --------- //
d.register("DashMainView",{
	create: function(data, config){
		return render("DashMainView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first. 


		// Add the first schedule with the direct scheduler.add 
		// Note 1: Here we add manually a schedule without a namespace, so, 
		//         we need to store the ns automatically created to remove it on .destroy
		// Important: The recommended way for view is to use the view.schedules below which is enabled by scheduler-hook.js.
		view.scheduleNs = scheduler.add({
			performFn: function(){
				return ajax.get("/api/cpuUsage");
			}, 
			receiveFn: function(data){
				if (data.length === 0){
					return; // do nothing, next cycle we might have the data
				}				
				var lastMeasure = data[data.length - 1];
				d.push(d.first(view.el, ".cpu-card.summary"), lastMeasure);				
			}
		});		
	},

	destroy: function(){
		var view = this;
		
		// For the manual scheduler, we must remove the schedule manually.
		scheduler.remove(view.scheduleNs);
	},

	// RECOMMENDED: Here we add the other schedule the view.schedules way which is managed by the scheduler-hook.js. 
	//              Those schedules will be added when the view get created and removed when the view is removed.
	schedules: [
		// memUsage 
		{
			performFn: function(){
				return ajax.get("/api/memUsage");
			},

			receiveFn: function(data){
				var view = this; // the performFn and receiveFn are added to the scheduler.js with this view instance as ctx (context)
				if (data.length === 0){
					return; // do nothing, next cycle we might have the data
				}
				var lastMeasure = data[data.length - 1];
				d.push(d.first(view.el, ".mem-card.summary"), {used: formatMb(lastMeasure.used),
					unused: formatMb(lastMeasure.unused)});					
			}
		}, 

		// topMem
		{
			performFn: function(){
				return ajax.get("/api/topMemProcs");
			},

			receiveFn: function(data){
				var view = this; // the performFn and receiveFn are added to the scheduler.js with this view instance as ctx (context)
				var items = data;
				var tbodyEl = d.first(view.el, ".mem-card .ui-tbody");

				// do nothing if empty data (still building it up on the server)
				if (items && items.length === 0){
					return;
				}

				// mark the items changed if they did
				markChanges(view.prevTopMemProcsDic, items, "pid", "mem");

				// build the topMemrocs dictionary with the latest data and store it in this view for next update
				view.prevTopMemProcsDic = utils.dic(items, "pid");

				// sort by name
				sortBy(items, "mem", "name");

				var html = render("DashMainView-mem-trs", {items: data});

				tbodyEl.innerHTML = html;

			}
		}, 

		// cpuUsage 
		// (see postDisplay: for the sake of this code example, it is done the manual way, see postDisplay)


		// topCpu
		{
			performFn: function(){
				return ajax.get("/api/topCpuProcs");
			},

			receiveFn: function(data){
				var view = this; 
				var items = data;
				var tbodyEl = d.first(view.el, ".cpu-card .ui-tbody");

				// do nothing if empty data (still building it up on the server)
				if (items && items.length === 0){
					return;
				}


				// mark the items changed if they did
				markChanges(view.prevTopCpuProcsDic, items, "pid", "cpu");

				// build the topCpuProcs dictionary with the latest data and store it in this view for next update
				view.prevTopCpuProcsDic = utils.dic(items, "pid");

				// sort by name
				sortBy(items, "cpu", "name");				

				// render and update the HTML table
				var html = render("DashMainView-cpu-trs", {items: items});
				tbodyEl.innerHTML = html;

			}
		}		

	]

});
// --------- /View Controller --------- //



// --------- Statics --------- //

// format a megabyte number as optimially as possible
function formatMb(num){
	var val = "" + num.toFixed(2);
	var unit = "M";
	if (num > 900){
		val = (num / 1000).toFixed(2);
		unit = "Gb";
	}
	val = val.replace(".00","");
	val = val + unit;
	return val;	
}

// Mark the items if their value changed compared to the previous store
function markChanges(prevDic, items, keyName, valName){

	// if no prevDic, nothing to do. 
	if (prevDic){
		items.forEach(function(item){
			var keyVal = item[keyName];
			var prevItem = prevDic[keyVal];

			// if there is no prevItem, then, it is a new item.
			if (!prevItem){
				item.changed = "changed-new";
			}
			// if we have a previous item, we compare the value to mark if it went up or down
			else{
				var val = item[valName];
				var prevVal = prevItem[valName];				
				if (val != prevVal){
					item.changed = (val > prevVal)?"changed-up":"changed-down";
				}
			}
		});
	}	

	return items;
}
// --------- /Statics --------- //



// --------- Utils --------- //
// cheap num extractor pattern
var numRgx = /[0-9\.]+/g;

function asNum(str){
	if (str){
		var numStrs = str.match(numRgx);
		if (numStrs && numStrs.length > 0){
			return parseFloat(numStrs[0]);	
		}
	}

	return null;
	
}

function sortBy(arr, keyNum, keyName){
	arr.sort(function(a, b){
		var anum = a[keyNum];
		var bnum = b[keyNum];
		// if they have the name num value, then, we compare the name
		if (anum === bnum){
			return (a[keyName].toLowerCase() > b[keyName].toLowerCase())?1:-1;
		}else{
			return (anum < bnum)?1:-1;
		}		
	});		
}
// --------- /Utils --------- //
