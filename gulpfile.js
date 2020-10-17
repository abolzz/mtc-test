// Gulpfile
var gulp = require('gulp'),
    connect = require('gulp-connect-php7'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin');

// Connects to a local webserver and reloads whenever the content is changed
gulp.task('connect', async function() {
  connect.server({
    // (need to specify local PHP install location)
    base: 'dist',
    bin: 'C:/Xampp/php/php.exe',
    ini: 'C:/Xampp/php/php.ini'
  }, function (){
      browserSync({
        proxy: '127.0.0.1:8000'
      });
    });
});

// Compiling scss to css, creating a sourcemap and minifying the output
var sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat');

gulp.task('sass', async function() {
  gulp.src('scss/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(cleanCSS())
  .pipe(concat('styles.min.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist/css'))
});

// Minify and concatenate all JS and create a sourcemap
var uglify = require('gulp-uglify');

gulp.task('js', async function() {
  gulp.src('js/*.js')
  .pipe(sourcemaps.init())
  .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
  .pipe(concat('scripts.min.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist/js'))
});

// Minifies the images
gulp.task('images', async function() {
    gulp.src('img/*')
        // .pipe(imagemin())
        .pipe(gulp.dest('dist/img'))
});

// Watch for file changes
gulp.task('watch', async function() {
  gulp.watch('img/*', gulp.series('images'));
  gulp.watch('js/*.js', gulp.series('js'));
  gulp.watch('scss/*.scss', gulp.series('sass'));
  var files = gulp.watch(['dist/*.html', 'dist/*.php', 'dist/includes/*.html', 'dist/includes/*.php', 'dist/css/*.css', 'dist/js/*.js', 'img/*']);
  files.on('change', function () {
    browserSync.reload();
  });
});

// Tasks that will happen by default
gulp.task('default', gulp.series('connect', 'watch'));