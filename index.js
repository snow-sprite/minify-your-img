const tinify = require('tinify')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const progress = require('./utils/progress')

const API_KEY = "fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN";
const target = path.resolve("target");
tinify.key = API_KEY

// 'dir' || 'file'
let style = process.argv[2]
// catalog || file
let detail = process.argv[3]

const MAXLEN = 10
function fileMin(style, detail) {
  initProgress(MAXLEN)
  ValidityApi()
  switch (style) {
    case 'file':
    // 单文件配置
    compresePic();
      break;
    case 'dir':
      // 目录配置
      break;
    default:
      break;
  }
}

function ValidityApi() {
  // Validation of API key failed.
  tinify.validate(function (err) {
    if (err) {
      console.error(
        chalk.bgRed(err.status),
        chalk.bgRed(err.message)
      );
    }
  });
}

function initProgress(m) {
  progress.maxLen = m
  let timer = setInterval(function () {
    if (progress.isDone) {
      clearInterval(timer)
      return
    }
    progress.init()
  }, 1000)
}

function compresePic() {
  // single picture
  fs.readFile(path.resolve(`./source/${detail}`), (err, file) => {
    if (err) throw err
    try {
      fs.access(target, fs.constants.F_OK, err => {
        if (err) throw err
        fs.readdir(target, "", (err, files) => {
          if (err) throw err
          if (files.length > 0) {
            files.map(file => {
              fs.unlinkSync(`${target}/${file}`, err => {
                if (err) throw err;
              });
            });
          }
          fs.rmdir(target, err => {
            if (err) throw err;
            fs.mkdir(target, err => {
              console.log(chalk.bgBlue.black("INFO"), 'Start compressing...')
              tinify
                .fromFile(path.resolve(`./source/${detail}`))
                .toFile(
                  `${target}/${detail.split(".")[0]}.min.${detail.split(".")[1]}`,
                  () => {
                          progress.isDone = true;
                          console.log(
                            chalk.bgGreen.black("DONE"),
                            chalk.green("Successful compression!")
                          );
                        }
                );
            });
          });
        });
      });
    } catch (error) {}
  });
}

fileMin(style, detail)