var hbsp = require("hbsp");
var path = require("path");
var concat = require('gulp-concat');
var gulp = require("gulp");
var del = require("del");
var fs = require("fs-extra");
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var ext_replace = require('gulp-ext-replace');

var hbsPrecompile = hbsp.precompile;

var webappDir = "";

// --------- postcss require --------- //
var postcss = require('gulp-postcss');
var cssImport = require('postcss-import'); // to allow mixin imports
var postcssMixins = require("postcss-mixins");
var postcssSimpleVars = require("postcss-simple-vars");
var postcssNested = require("postcss-nested");
var cssnext = require('postcss-cssnext');

var processors = [
	cssImport,
	postcssMixins,
	postcssSimpleVars,
	postcssNested,
	cssnext({ browsers: ['last 2 versions'] })
];
// --------- /postcss require --------- //

var jsDir = path.join(webappDir,"web/js/");
var cssDir = path.join(webappDir,"web/css/");

gulp.task('default',['clean', 'pcss', 'tmpl', 'lib-bundle', 'app-bundle']);

// --------- Web Assets Processing --------- //
gulp.task('watch', ['default'], function(){

	// Watch the lib-bundle and app-bundle
	gulp.watch(path.join(webappDir,"src/js-lib/*.js"), ['lib-bundle']);
	gulp.watch(path.join(webappDir,"src/js-app/*.js"), ['app-bundle']);

	// for the common pcss app
	gulp.watch(path.join(webappDir,"src/pcss/*.pcss"), ['pcss']);

	gulp.watch(path.join(webappDir,"src/view/**/*.tmpl"), ['tmpl']);
	gulp.watch(path.join(webappDir,"src/view/**/*.pcss"), ['pcss']);
	gulp.watch(path.join(webappDir,"src/view/**/*.js"), ['app-bundle']);
	//gulp.watch(path.join(webappDir,"src/view/*.tmpl"), ['app-bundle']);
});


gulp.task('clean', function(){
	var dirs = [cssDir, jsDir];
	
	var dir;
	for (var i = 0; i < dirs.length ; i ++){
		dir = dirs[i];
		// make sure the directories exists (they might not in fresh clone)
		if (!fs.existsSync(dir)) {
			fs.mkdir(dir);
		}
		// delete the .css and .js files (this makes sure we do not )
		del.sync(dir + "*.css");
		del.sync(dir + "*.js");
		del.sync(dir + "*.map");
	}
});

gulp.task('tmpl', function() {
	gulp.src(path.join(webappDir,"src/view/**/*.tmpl"))
		.pipe(hbsPrecompile())
		.pipe(concat("templates.js"))
		.pipe(gulp.dest(jsDir));
});

gulp.task('pcss', function() {
	// make sure to get the src/pcss first, and then, the view pcss
	gulp.src([path.join(webappDir,"src/pcss/*.pcss"),path.join(webappDir,"src/view/**/*.pcss")])
		.pipe(sourcemaps.init())
		.pipe(postcss(processors))
		.pipe(concat('all-bundle.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(cssDir));
});


// lib bundle is the javascripts libs code that are used in the app
gulp.task('lib-bundle', function() {
	return browserify({entries: filesSync("src/js-lib/", ".js"), debug: true})
		.bundle()
		.pipe(source('lib-bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))	
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(jsDir));
});

gulp.task('test', function(){
	filesSync(["src/js-app/","src/view/"], ".js").forEach(f => console.log(f));
});

// app bundle is the javascripts view js and application common code that are used in the app
gulp.task('app-bundle', function() {
	return browserify({entries: filesSync(["src/js-app/","src/view/"], ".js"), debug: true})
		.bundle()
		.pipe(source('app-bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))	
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(jsDir));
});

// --------- /Web Assets Processing --------- //

// --------- utils --------- //
// build a flat file list from a dir (or directories) that match and ending
// - dirs: Can be a single string (dir path) or an array of dir paths
// - deep: Tell if we go recursive or not.
// - ending: teel 
function filesSync(dirs, ending, deep = true, fileList = []){
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
		filesSync(subDirs, ending, deep, fileList);
	}

	return fileList;
}

// --------- /utils --------- //