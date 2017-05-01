const router = require("cmdrouter");
const async6 = require("async6");
const browserify = require("browserify");
const path = require("path");
const fs = require("fs-extra");
const exorcist = require("exorcist");
const postcss = require("postcss");
const hbsPrecompile = require("hbsp").precompile; // promise style

const utils = require("./utils.js");

const readFile = async6.promisify(fs.readFile, fs);
const writeFile = async6.promisify(fs.writeFile, fs);

const processors = [
	require("postcss-import"),
	require("postcss-mixins"),
	require("postcss-simple-vars"),
	require("postcss-nested"),
	require("postcss-cssnext")({ browsers: ["last 2 versions"] })
];

// Define the constant for this project (needs to be before the router...route())
const baseDir = path.resolve(__dirname, "../");
const srcDir = path.join(baseDir, "src/");
const webDir = path.join(baseDir, "web/");

const jsDistDir = path.resolve(webDir, "js/");
const cssDistDir = path.resolve(webDir, "css/");

// we route the command to the appropriate function
router({_default, js, css, tmpl, watch}).route();


// --------- Command Functions --------- //
function* _default(){
	yield* js();
	yield* css();
	yield* tmpl();
}

function* js(mode){
	ensureDist();

	if (!mode || mode === "lib"){
		yield browserifyFiles(utils.listFilesSync("src/js-lib/", ".js"), 
													path.join(webDir, "js/lib-bundle.js"));
	}

	if (!mode || mode === "app"){
		yield browserifyFiles(utils.listFilesSync(["src/js-app/","src/view/"], ".js"), 
													path.join(webDir, "js/app-bundle.js"));
	}
}

function* css(){
	ensureDist();

	yield* pcssFiles(utils.listFilesSync(["src/pcss/","src/view/"], ".pcss"), 
									path.join(cssDistDir, "all-bundle.css"));

}

function* tmpl(){
	ensureDist();

	var distFile = path.join(webDir, "js/templates.js");
	utils.removeFilesSync([distFile]);

	console.log("template - " + distFile);

	var files = utils.listFilesSync("src/view/", ".tmpl");

	var templateContent = [];

	for (let file of files){

		let htmlTemplate = yield readFile(file, "utf8");
		let template = yield hbsPrecompile(file, htmlTemplate);
		templateContent.push(template);
	}

	writeFile(distFile,templateContent.join("\n"),"utf8");
}


function* watch(){
	// first we build all
	yield _default();

	utils.watch(["src/js-lib/"], ".js", (action, name) => {
		async6.run(js("lib"));
	});

	utils.watch(["src/js-app/","src/view/"], ".js", (action, name) => {
		async6.run(js("app"));
	});	

	utils.watch(["src/pcss/","src/view/"], ".css", (action, name) => {
		async6.run(css());
	});	

	utils.watch(["src/view/"], ".tmpl", (action, name) => {
		async6.run(tmpl());
	});
}
// --------- /Command Functions --------- //


// --------- Utils --------- //

// make sure the dist folder exists
function ensureDist(){
	fs.ensureDirSync(jsDistDir);
	fs.ensureDirSync(cssDistDir);
}

function* pcssFiles(entries, distFile){
	console.log("postcss - " + distFile);

	var mapFile = distFile + ".map";	
	utils.removeFilesSync([distFile, mapFile]);

	var processor = postcss(processors);
	var pcssNodes = [];

	// we parse all of the .pcss files
	for (let srcFile of entries){
		// read the file
		let pcss = yield readFile(srcFile, "utf8");

		var pcssNode = postcss.parse(pcss, {
			from: srcFile
		});
		pcssNodes.push(pcssNode);
	}

	// build build the combined rootNode and its result
	var rootNode = null;
	for (let pcssNode of pcssNodes){
		rootNode = (rootNode)?rootNode.append(pcssNode):pcssNode;
	}
	var rootNodeResult = rootNode.toResult();

	// we process the rootNodeResult
	var pcssResult = yield processor.process(rootNodeResult,{
		to: distFile,
		map: { inline: false}});

	// we write the .css and .map files
	yield writeFile(distFile, pcssResult.css, "utf8");
	yield writeFile(mapFile, pcssResult.map, "utf8");
}

function browserifyFiles(entries, distFile){
	console.log("browserify - " + distFile);

	var mapFile = distFile + ".map";	
	utils.removeFilesSync([distFile, mapFile]);

	var b = browserify({ 
		entries,
		entry: true, 
		debug: true  
	});
	
	// wrap the async browserify bundle into a promise to make it "async" friendlier
	return new Promise(function(resolve, fail){
		b.bundle()
			.on("error", function (err) { fail(err); })
			.on("end", function(){ resolve(); })
			.pipe(exorcist(mapFile))
			.pipe(fs.createWriteStream(distFile));
	});	
}
// --------- /Utils --------- //
