const tinify = require('tinify')
const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const API_KEY = "fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN"
tinify.key = API_KEY
let arg = process.argv[2]
const targetOnline = path.resolve("targetOnline")
const progress = require('./utils/progress')

function getName(address) {
  let addressArr = address.split('/')
  let name = addressArr[addressArr.length - 1]
  return `${name.split(".")[0]}.min.${name.split(".")[1]}`
}

function regImg() {
  // Verify the url
  let reg = /^(http|https):\/\//gi;
  if (!reg.test(arg)) {
    console.log(chalk.bgYellow('WARN'), "Sorry, online pictures only!");
    return false
  }
  return true
}

const MAXLEN = 7

function rebuildTarget() {
  fs.readdir(targetOnline, "", (err, files) => {
    if (err) throw err;
    if (regImg()) {
      tinify.fromUrl(arg).toFile(`${targetOnline}/${getName(arg)}`, () => {
        progress.isDone = true;
        console.log(
          chalk.bgGreen.black("DONE"),
          `The file is saved in the ${chalk.bold.underline('targetOnline')} folder`
        );
      });
    } else {
      progress.isDone = true;
    }
  });
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
  console.log('Thank you for using minify-your-img\n')
  console
    .log(chalk.green(
         `              _    _
             ${chalk.white('(o)--(o)')}
            /${chalk.white('.______.')}\\
            \\________/
           ./        \\.
           ( .      , )
           \ \_\\\\ //_/ /
            ~~  ~~  ~~`))
  console.log('===================================\n')
  console.log(chalk.bgBlue.black("INFO"), 'Start compressing...')
  let timer = setInterval(function () {
    if (progress.isDone) {
      clearInterval(timer)
      return
    }
    progress.init()
  }, 1000)
}

function compresePic() {
  // comprese image..
  try {
    fs.access(targetOnline, fs.constants.F_OK, err => {
      // if there's not a targetOline dir, make it first.
      if (err) {
        fs.mkdir(targetOnline, () => {
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

function urlMin() {
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

urlMin()