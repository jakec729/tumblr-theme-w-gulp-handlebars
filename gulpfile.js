var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var plubmer = require('gulp-plumber');
var inline_css = require('gulp-inline-css');
var minify_css = require('gulp-minify-css');
var rename = require('gulp-rename');
var handlebars = require('gulp-compile-handlebars');

var paths = {
	'sass_dir': './assets/sass',
	'stylesheets': './assets/sass/**/*.scss',
	'css_dir': './assets/css',
	'primary_template': './src/index.hbs',
	'templates': ['./src/*.hbs', './src/**/*.hbs'],
	'partials_dir': './src/partials'
};

gulp.task('sass', function () {
	gulp.src(paths.stylesheets)
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
            cascade: false
		}))
		.pipe(gulp.dest(paths.css_dir));
});

gulp.task('minify', function () {
	gulp.src(paths.css_dir + '/style.css')
		.pipe(rename({ suffix: ".min" }))
		.pipe(minify_css())
		.pipe(gulp.dest(paths.css_dir));
});

gulp.task('templates', function() {
    var templateData = {},
    options = {
        ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
        batch : [paths.partials_dir],
    }
    return gulp.src(paths.primary_template)
        .pipe(handlebars(templateData, options))
        .pipe(rename({
        	extname: ".html"
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
	gulp.watch( paths.stylesheets, ['styles'] );
	gulp.watch( paths.templates, ['templates'] );
});

gulp.task('styles', ['sass', 'minify'] );
gulp.task('build', ['templates'] );

gulp.task('default', ['styles', 'build', 'watch']);

