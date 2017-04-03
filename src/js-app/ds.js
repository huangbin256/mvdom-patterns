var d = mvdom; // external lib
var ajax = require("./ajax.js");

// The `ds` module is the DataService module which is the layer to access data. The pattern here is that, 
// the first param is the object type, which allows to have a single access points to data and start with dynamic/generic
// CRUD behavior and customize as needed behind the scene.

// filter: {offset:0, limit: 300, cond, orderBy, }
// cond: {"title": "exactmatch", "firstName;ilike":"%jen%", "age;>": 30}
// orderBy: "lastName" or "!age" (age descending) or ["!age", "lastName"]


module.exports = {
	get: get,
	first: first,
	list: list, 
	create: create,
	update: update, 
	remove: remove, 
	on: on, 
	off: off,
}; 

var dsHub = d.hub("dsHub");

function get(type, id){
	return new Promise(function(r,f){
		r({id:id,name:"demo"});
	});
}

function first(type, filter){
	dsHub.trigger(type, "first", {type: type, labels: "first", });
}

function list(type, filter){

}

function update(){

}

function remove(){

}

function create(type, entity){
	return new Promise(function(r,f){
		r({id:id,name:"demo"});
	}).then(function(){
		dsHub.trigger(type, "create", {info: entity, id: id});
	});
}

// e.g., on("Task", "create, delete, update", ...)
function on(type, selector, fun, opts){
	dsHub.on(type, selector, fun, opts);
}


function off(ns){
	dsHub.off({ns:ns});
}
