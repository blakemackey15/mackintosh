var gulp = require("gulp");
var server = require("gulp-webserver");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

//Create project
gulp.task("default", function() {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

//Start and setup server
gulp.task("server", function() {
    gulp.src("dist")
        .pipe(server({
            livereload: true,
            open: true,
            port: 6000
    }));
});

gulp.task("default", ["server"]);