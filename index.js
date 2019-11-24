const tinify = require('tinify')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const API_KEY = "fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN";
const target = path.resolve("target");
tinify.key = API_KEY

// 'dir' || 'file'
let style = process.argv[2]
// catalog || file
let detail = process.argv[3]

function fileMin(style, detail) {
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
// TODO 进度条
var progress = {
  str: '',
  len: 0,
  maxLen: 5,
  opt: add
}
var bool = false
function progressSet() {
  var tiemr = setInterval(() => {
    if (bool) {
      clearInterval(tiemr);
      return
    }

    if (progress.len < progress.maxLen && progress.len > 0) {
      progress.len++;
      progress.str += " =";
    } else if (progress.len >= progress.maxLen) {
      progress.len--
      progress.str = progress.str.substring(0, progress.str.length - 1)
    } else {
      progress.len++;
      progress.str += ' ='
    }
    console.log(progress.str);
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
              // console.log(progressArr)
              progressSet()
              tinify
                .fromFile(path.resolve(`./source/${detail}`))
                .toFile(
                  `${target}/${detail.split(".")[0]}.min.${detail.split(".")[1]}`,
                  () => {
                          bool = true;
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