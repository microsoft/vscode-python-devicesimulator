/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const gulp = require("gulp");

const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const typescript = require("typescript");
const del = require("del");
const es = require("event-stream");
const vsce = require("vsce");
const nls = require("vscode-nls-dev");

const tsProject = ts.createProject("./tsconfig.json", { typescript });

const inlineMap = true;
const inlineSource = false;
const outDest = "out";

// A list of all locales supported by VSCode can be found here: https://code.visualstudio.com/docs/getstarted/locales
const languages = [{ folderName: "en", id: "en" }];

gulp.task("clean", () => {
  return del(
    [
      "out/*",
      "package.nls.*.json",
      "../../dist/*0.0.0-UNTRACKEDVERSION.vsix",
    ],
    { force: true }
  );
});

const pythonToMove = [
  "./src/adafruit_circuitplayground/*.*",
  "./src/clue/*.*",
  "./src/clue/!(test)/**/*",
  "./src/base_circuitpython/**/*",
  "./src/micropython/*.*",
  "./src/micropython/microbit/*.*",
  "./src/micropython/microbit/!(test)/**/*",
  "./src/*.py",
  "./src/common/*.py",
  "./src/dev-requirements.txt",
  "./src/requirements.txt",
  "./src/templates/*.*"
];

gulp.task("python-compile", () => {
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  return gulp.src(pythonToMove, { base: "./src/" }).pipe(gulp.dest("out"));
});

gulp.task("internal-compile", () => {
  return compile(false);
});

gulp.task("internal-nls-compile", () => {
  return compile(true);
});

gulp.task("add-locales", () => {
  return gulp
    .src(["package.nls.json"])
    .pipe(nls.createAdditionalLanguageFiles(languages, "locales"))
    .pipe(gulp.dest("."));
});

gulp.task("vsce:publish", () => {
  return vsce.publish();
});

gulp.task("vsce:package", () => {
  return vsce.createVSIX({
    packagePath:
      "../../dist/deviceSimulatorExpress-0.0.0-UNTRACKEDVERSION.vsix",
  });
});

gulp.task(
  "compile",
  gulp.series("clean", "internal-compile", "python-compile", callback => {
    callback();
  })
);

gulp.task(
  "build",
  gulp.series(
    "clean",
    "internal-nls-compile",
    "python-compile",
    "add-locales",
    callback => {
      callback();
    }
  )
);

gulp.task(
  "publish",
  gulp.series("compile", "vsce:publish", callback => {
    callback();
  })
);

gulp.task(
  "package",
  gulp.series("compile", "vsce:package", callback => {
    callback();
  })
);

//---- internal

function compile(buildNls) {
  var r = tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(buildNls ? nls.rewriteLocalizeCalls() : es.through())
    .pipe(
      buildNls
        ? nls.createAdditionalLanguageFiles(languages, "locales", "out")
        : es.through()
    );

  if (inlineMap && inlineSource) {
    r = r.pipe(sourcemaps.write());
  } else {
    r = r.pipe(
      sourcemaps.write("../out", {
        // no inlined source
        includeContent: inlineSource,
        // Return relative source map root directories per file.
        sourceRoot: "../src",
      })
    );
  }

  return r.pipe(gulp.dest(outDest));
}
