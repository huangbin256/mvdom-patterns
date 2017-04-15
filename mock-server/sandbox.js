const top = require("node-top");


var delay = 1000;

topFetch();

function topFetch(){
	top.fetch().then(function(data){
		console.log(data.stats);
		setTimeout(topFetch, delay);
	}).catch(function(ex){
		console.log("FAIL - top.fetch - " + ex);
	});
}
