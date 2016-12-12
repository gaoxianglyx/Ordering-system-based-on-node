var gulp = require('gulp');
        sass = require("gulp-sass");
        sourcemaps = require("gulp-sourcemaps");
        sprite = require("gulp.spritesmith");
var nodemon = require("gulp-nodemon");
var jshint = require('gulp-jshint');
// 编译 sass
gulp.task('sass', function() {
    gulp.src('public/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('public/css'));
        gulp.watch('public/css/*.scss', ['sass']);
});
// 监听 app.js /*, 自动重启服务// 编译 sass
gulp.task('serve-dev', function() {
    var options = {
        script: 'app.js',
        execMap: { 
            "js": "node --harmony"
        },
        ext: "js json ejs css",
        env: {
            /*'PORT': port,*/
            'NODE_ENV': 'development'
        },
        watch: ['routes/*.js','views/*.ejs','views/*/*.ejs','public/*/*.js','public/*/*.css']
    };

    nodemon(options).on('restart', function(files) {
        console.log('App restarted due to: ', files);
    });
});
//检测js语法错误
gulp.task('lint', function() {
    gulp.src('routes/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
        gulp.watch('routes/*.js');
});
gulp.task('sprite', function() {
    var spriteData = gulp.src('public/img/*.png')
        .pipe(sprite({
            //此处遇到问题，输出css文件有icon前缀，应该是需要引入sass模板来规范输出的css样式
            imgName: 'sprite-common.png',
            cssName: 'sprite-common.css',
            padding: 10
    }));

    spriteData.img.pipe(gulp.dest('public/img/common'));
    spriteData.css.pipe(gulp.dest('public/css/common'));
});
gulp.task('default',function(){
    gulp.run('serve-dev','lint','sass','sprite');
});