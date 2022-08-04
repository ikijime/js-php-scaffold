const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require("gulp-sass")(require('sass'));

const public = "./app/public/admin";
const prod = "./build";
const autoprefixer = require("autoprefixer");
const cleanCss = require("gulp-clean-css");
const postCss = require("gulp-postcss");
const purgecss = require('gulp-purgecss')

// Gulp concat-css for multiple css files

// copy files to server static
gulp.task("copy-html", () => {
  return gulp.src("./app/src/index.html")
    .pipe(gulp.dest(public));
});

const webpackSettings = {
  mode: "development",
  output: {
    filename: "main.js",
  },
  watch: false,
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [['@babel/preset-env', {
                debug: true,
                corejs: 3,
                useBuiltIns: "usage"
            }],
            "@babel/react"]
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
};

gulp.task("build-js", () => {
  return gulp
    .src("./app/src/main.js")
    .pipe(webpack(webpackSettings))
    .pipe(gulp.dest(public));
});

gulp.task("build-css", () => {
    return gulp
      .src("./app/scss/style.scss")
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(public));
});

gulp.task("copy-api", () => {
  return gulp
    .src("./app/api/**/*.*")
    .pipe(gulp.dest(public + "/api"));
});

gulp.task("copy-assets", () => {
  return gulp
    .src("./app/assets/**/*.*")
    .pipe(gulp.dest(public + "/assets"));
});


gulp.task("watch", () => {
  gulp.watch("./app/src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./app/assets/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch("./app/api/**/*.*", gulp.parallel("copy-api"));
  gulp.watch(["./app/src/**/*.js", "./app/src/**/*.jsx"], gulp.parallel("build-js"));
  gulp.watch("./app/scss/**/*.scss", gulp.parallel("build-css"));
}); 

gulp.task("build", gulp.parallel("copy-html", "copy-assets", "copy-api", "build-js", "build-css"));

const webpackProdSettings = {
  mode: "production",
  output: {
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [['@babel/preset-env', {
                debug: false,
                corejs: 3,
                useBuiltIns: "usage"
            }],
            "@babel/react"]
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
};

gulp.task("prod", () => {
  gulp.src("./app/src/index.html").pipe(gulp.dest(prod));
  gulp.src("./app/api/**/*.*").pipe(gulp.dest(prod + "/api"));
  gulp.src("./app/assets/**/*.*").pipe(gulp.dest(prod + "/assets"));
  gulp
      .src("./app/src/main.js")
      .pipe(webpack(webpackProdSettings))
      .pipe(gulp.dest(prod));
  return gulp
      .src("./app/scss/style.scss")
      .pipe(sass().on('error', sass.logError))
      .pipe(postCss([autoprefixer()]))
      .pipe(cleanCss())
      .pipe(gulp.dest(prod));
});

gulp.task('purgecss', () => {
  return gulp.src('./build/style.css')
      .pipe(purgecss({
          content: ['./build/index.html']
      }))
      .pipe(gulp.dest(prod))
})

gulp.task("default", gulp.parallel("watch", "build"));