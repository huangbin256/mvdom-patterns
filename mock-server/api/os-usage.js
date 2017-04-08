const usage = require("os-usage");

const routes = []; 

const baseURI = "/api";

// This export One Extension that can have multiple routes 
// that will be loaded by server
module.exports = routes;


// --------- Data Capture --------- //
var usageLimit = 10;

var cpuMonitor = new usage.CpuMonitor({limit:30});

var cpuUsageData = [];
var topCpuProcs;

cpuMonitor.on('cpuUsage', function(data) {
	// data:  { user: '9.33', sys: '56.0', idle: '34.66' }
	_addData(cpuUsageData, data);
});

cpuMonitor.on('topCpuProcs', function(data) {
	// data: [{ pid: '21670', cpu: '0.0', command: 'LookupViewServic' } ]
	topCpuProcs = data;
});


var memUsageData = [];
var topMemProcs;

var memMonitor = new usage.MemMonitor({limit:30});

// watch memory usage overview 
memMonitor.on('memUsage', function(data) {
	// { used: '9377M', wired: '2442M', unused: '7005M' } 
	_addData(memUsageData, data);
});

memMonitor.on("topMemProcs", function(data){
	// [ { pid: '0', mem: '1521M', command: 'kernel_task' }
	topMemProcs = data;
});

// private function that add an new data item to its list, add time, max the list at usageLimit 
function _addData(list, data){
	const nowMs = new Date().getTime();

	data.time = nowMs;
	list.push(data);

	if (list.length > usageLimit){
		list.splice(0,1);
	}	
}

// --------- /Data Capture --------- //

// --------- Usage APIs --------- //
routes.push({
	method: 'GET',
	path: baseURI + "/cpuUsage", 
	handler: {
		async: function(request, reply){
			reply(cpuUsageData);
		}
	}
});

routes.push({
	method: 'GET',
	path: baseURI + "/topCpuProcs", 
	handler: {
		async: function(request, reply){
			//[ { pid: '21749', cpu: '0.0', command: 'top' },
			reply(topCpuProcs);
		}
	}
});


routes.push({
	method: 'GET',
	path: baseURI + "/memUsage", 
	handler: {
		async: function(request, reply){
			reply(memUsageData);
		}
	}
});



routes.push({
	method: 'GET',
	path: baseURI + "/topMemProcs", 
	handler: {
		async: function(request, reply){
			reply(topMemProcs);
		}
	}
});
// --------- /Usage APIs --------- //
