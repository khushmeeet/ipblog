const gulp = require("gulp");
const gutil = require("gulp-util");
const browserify = require("browserify");
const clean = require("gulp-clean");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const shell = require("gulp-run");

gulp.task("clean", () => {
	return gulp.src("src/bundle*.js", { read: false }).pipe(clean());
});

gulp.task("bundle_index", () => {
	var bundle = browserify({
		entries: "src/index.js", // Only need initial file, browserify finds the deps
		debug: true // Enable sourcemaps
	});

	return bundle
		.bundle()
		.pipe(source("./bundle_index.js")) // destination file for browserify, relative to gulp.des
		.pipe(gulp.dest("src/"));
});

gulp.task("bundle_list", () => {
	var bundle = browserify({
		entries: "src/list.js",
		debug: true
	});
	return bundle
		.bundle()
		.pipe(source("./bundle_list.js"))
		.pipe(gulp.dest("src/"));
});

gulp.task("watch-public", function() {
	gulp.watch(["static/*.css", "src/index.js", "src/list.js"], ["bundle_index", "bundle_list"]);
});

gulp.task("server", () => {
	gutil.log("Server Running.....");
	return shell("python -m http.server").exec();
});

gulp.task(
	"default",
	["clean", "bundle_index", "bundle_list", "watch-public", "server"],
	() => {}
);
