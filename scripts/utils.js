
const path = require("path");
const fs = require("fs-extra");

module.exports = {removeFilesSync, listFilesSync};


// Clean the output files (.js or .css). 
// - Will also clean the matching .map if exists.
// - Will also ensure the dist js and css folder exist
function removeFilesSync(files){
	var pathToCheck = path.resolve(__dirname, "../");
	
	for (var file of files){
		if (fs.pathExistsSync(file)){
			if (file.includes(pathToCheck)){
				fs.unlinkSync(file);	
			}else{
				throw `File [${file}] does not seem safe to remove.`;
			}
			
		}
	}
}

// build a flat file list from a dir (or directories) that match and ending
// - dirs: Can be a single string (dir path) or an array of dir paths
// - deep: Tell if we go recursive or not.
// - ending: optional required ending (like ".js") 
function listFilesSync(dirs, ending, deep = true, fileList = []){
	var subDirs = [];
	// make it an array
	dirs = (dirs instanceof Array)?dirs:[dirs];

	for (let dir of dirs){
		fs.readdirSync(dir).forEach(file => {
			const filePath = path.join(dir, file);

			if (fs.statSync(filePath).isDirectory()){
				subDirs.push(filePath);
			}else if (!ending || filePath.endsWith(ending)){
				fileList.push(filePath);
			}
		});		
	}

	// we do the subdirs after, so that the root files are before in the list that the sub directory files
	if (deep && subDirs.length > 0){
		listFilesSync(subDirs, ending, deep, fileList);
	}

	return fileList;
}