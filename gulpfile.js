const { src, dest, task, series, parallel, watch } = require('gulp'),
    browserSync = require('browser-sync').create(),
    pug = require('gulp-pug'),
    data = require('gulp-data'),
    del = require('del'),
    fs = require('fs');

const COMPILE_FOLDER = './dist';
const SRC_FOLDER = './src';
const SOURCES_FOLDER = [
    './src/**/*.pug',
    '!./src/layouts/**/*.pug',
    '!./src/components/**/*.pug',
    '!./src/mixins/**/*.pug'
]
const ASSETS_FOLDER = {
    STYLES: 'assets/css',
    SCRIPTS: 'assets/js',
    FONTS: 'assets/fonts',
    IMAGES: 'assets/img'
}

// Tasks

const cleanTask = () => del(COMPILE_FOLDER, { force: true });

const stylesTask = () => src(`${SRC_FOLDER}/${ASSETS_FOLDER.STYLES}/**/*`)
    .pipe(dest(`${COMPILE_FOLDER}/${ASSETS_FOLDER.STYLES}`))
    .pipe(browserSync.stream());

const scriptsTask = () => src(`${SRC_FOLDER}/${ASSETS_FOLDER.SCRIPTS}/**/*`)
    .pipe(dest(`${COMPILE_FOLDER}/${ASSETS_FOLDER.SCRIPTS}`))
    .pipe(browserSync.stream());

const fontsTask = () => src(`${SRC_FOLDER}/${ASSETS_FOLDER.FONTS}/**/*`)
    .pipe(dest(`${COMPILE_FOLDER}/${ASSETS_FOLDER.FONTS}`))
    .pipe(browserSync.stream());

const imagesTask = () => src(`${SRC_FOLDER}/${ASSETS_FOLDER.IMAGES}/**/*`)
    .pipe(dest(`${COMPILE_FOLDER}/${ASSETS_FOLDER.IMAGES}`))
    .pipe(browserSync.stream());

const viewsTask = () => src(SOURCES_FOLDER)
    .pipe(data(function () {
        return JSON.parse(fs.readFileSync('./src/data.json'))
    }))
    .pipe(pug({ basedir: './src' }))
    .pipe(dest(COMPILE_FOLDER))
    .pipe(browserSync.stream());

const buildTask = parallel(viewsTask, stylesTask, scriptsTask, fontsTask, imagesTask);

const viewsWatch = () => watch(`${SRC_FOLDER}/**/*.pug`, viewsTask);
const imagesWatch = () => watch(`${SRC_FOLDER}/${ASSETS_FOLDER.IMAGES}/**/*`, imagesTask);
const fontsWatch = () => watch(`${SRC_FOLDER}/${ASSETS_FOLDER.FONTS}/**/*`, fontsTask);
const stylesWatch = () => watch(`${SRC_FOLDER}/${ASSETS_FOLDER.STYLES}/**/*`, stylesTask);
const scriptsWatch = () => watch(`${SRC_FOLDER}/${ASSETS_FOLDER.SCRIPTS}/**/*`, scriptsTask);
const distWatch = () => watch(`${COMPILE_FOLDER}/**/*`, browserSync.reload);

const startServer = () => browserSync.init({
    server: {
        baseDir: `${COMPILE_FOLDER}`,
    },
    browser: "firefox"
});

const watchTask = parallel(
    startServer,
    viewsWatch,
    imagesWatch,
    fontsWatch,
    stylesWatch,
    scriptsWatch,
    distWatch
);

task('compile', series(cleanTask, buildTask));
task('serve', series(cleanTask, buildTask, startServer));
task('default', series(cleanTask, buildTask, watchTask));
