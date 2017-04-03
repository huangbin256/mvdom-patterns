const usage = require("os-usage");

const routes = []; 

const baseURI = "/api";

// This export One Extension that can have multiple routes 
// that will be loaded by server
module.exports = routes;


// --------- Data Capture --------- //
var usageLimit = 10;

var cpuMonitor = new usage.CpuMonitor();

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

var memMonitor = new usage.MemMonitor();
// watch memory usage overview 
memMonitor.on('memUsage', function(data) {
	// { used: '9377M', wired: '2442M', unused: '7005M' } 
	_addData(memUsageData, data);
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

// --------- Route APIs --------- //
routes.push({
	method: 'GET',
	path: baseURI + "/cpuUsage", 
	handler: {
		async: apiCpuUsage
	}
});

function apiCpuUsage(request, reply){
	reply(cpuUsageData);
}



routes.push({
	method: 'GET',
	path: baseURI + "/topCpuProcs", 
	handler: {
		async: apiTopCpuProcs
	}
});

function apiTopCpuProcs(request, reply){
	//[ { pid: '21749', cpu: '0.0', command: 'top' },
	reply(topCpuProcs);
}


routes.push({
	method: 'GET',
	path: baseURI + "/memUsage", 
	handler: {
		async: apiMemUsage
	}
});

function apiMemUsage(request, reply){
	reply(memUsageData);
}

// --------- /Route APIs --------- //
