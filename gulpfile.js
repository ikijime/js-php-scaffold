const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require("gulp-sass")(require('sass'));

const public = "./app/public";
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
        test: /\.m?js$/,
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
  gulp.watch("./app/src/**/*.js", gulp.parallel("build-js"));
  gulp.watch("./app/scss/**/*.scss", gulp.parallel("build-css"));
}); 

gulp.task("build", gulp.parallel("copy-html", "copy-assets", "copy-api", "build-js", "build-css"));

gulp.task("default", gulp.parallel("watch", "build"));
