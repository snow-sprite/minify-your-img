const tinify = require('tinify')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const progress = require('./utils/progress')
const target = path.resolve("target")

const API_KEY = "fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN"
tinify.key = API_KEY

function filePath(fod) {
  return path.join(__dirname, `./source/`, `${fod}`)
}

const MAXLEN = 15
let unFinishedFiles = 0
let finishedFiles = 0

function fileMin() {
  initProgress(MAXLEN)
  validityApi()
    .then(() => {
      compresePic();
    })
    .catch(err => {
      progress.isDone = true
      console.log(chalk.bgRed(`ERROR`), chalk.red(err.message))
    })
}

function validityApi() {
  // Validation of API key failed.
  return new Promise((resolve, reject) => {
    tinify.validate(function (err) {
      if (err) {
        reject(err)
        return
      }
      resolve()
    });
  })
}

function initProgress(m) {
  // init progressing..
  console.log('===================================\n')
  console.log('Thank you for using minify-your-img.\n')
  console
    .log(chalk.green(
         `             _    _
            ${chalk.white('(o)--(o)')}
           /${chalk.white('.______.')}\\
           \\________/
          ./        \\.
          ( .      , )
          \ \_\\\\ //_/ /
           ~~  ~~  ~~`))
  console.log('===================================\n')
  console.log(chalk.bgBlue.black("INFO"), 'Start compressing...')
  progress.maxLen = m
  let timer = setInterval(function () {
    if (progress.isDone) {
      clearInterval(timer)
      return
    }
    progress.init()
  }, 1000)
}

function fileReader(fod) {
  // read file from the source
  fs.readdir(filePath(fod), (errs, stats) => {
    unFinishedFiles = stats.length
    if (errs) throw errs
    stats.forEach(stat => {
      fs.stat(filePath(stat), (err, st) => {
        if (err) throw err
        if (st.isFile()) {
          tinify
            .fromFile(
              path.join(__dirname, `/source/${stat}`)
            )
            .toFile(`${target}/${stat.split(".")[0]}.min.${stat.split(".")[1]}`, () => {
              finishedFiles += 1
              if (finishedFiles == unFinishedFiles) {
                progress.isDone = true;
                console.log(
                  chalk.bgGreen.black("DONE"),
                  chalk.green(`${finishedFiles}`),
                  'files were successfully compressed!'
                );
              }
            })
        } else if (st.isDirectory()) {
          // console.log(chalk.bgYellow('WARN'), 'Directory is not supported yet..\n')
          unFinishedFiles -= 1
        }
      })
    })
  })
}

function rebuildTarget() {
  fs.readdir(target, "", (err, files) => {
    if (err) throw err;
    if (files.length > 0) {
      files.map(file => {
        fs.unlinkSync(`${target}/${file}`, err => {
          if (err) throw err;
        });
      });
    }
    fs.rmdir(target, errs => {
      if (errs) throw errs;
      fs.mkdir(target, err => {
        if (err) throw err;
        fileReader("./");
      });
    });
  });
}

function compresePic() {
  // comprese image..
  try {
    fs.access(target, fs.constants.F_OK, err => {
      // if there's not a target dir, make it first.
      if (err) {
        fs.mkdir(target, () => {
          rebuildTarget()
        })
      } else {
        rebuildTarget()
      }
    });
  } catch (error) {
    throw error
  }
}

fileMin()