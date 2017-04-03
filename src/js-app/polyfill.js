

// Older browsers do not have the forEach on the NodeList object. 
// make sure to add forEach to NodeList (most modern browser will not need this)
if (typeof NodeList.prototype.forEach === "undefined") {
	NodeList.prototype.forEach = Array.prototype.forEach;
}

