// const tinify = require('tinify')
const fs = require('fs')
const path = require('path')
// const API_KEY = 'fvDPnGNpDZRJsrtR5KdM4Qcbp8RvcYhN'
//
// tinify.key = API_KEY

function filePath(fod = '') {
  return path.join(__dirname, `./source/`, `${fod}`)
}

function loop(fod = '') {
  fs.readdir(filePath(fod), (errs, stats) => {
    if (!errs) {
      stats.forEach(stat => {
        console.log('0', stat)
        fs.stat(filePath(stat), (err, st) => {
          if (!err) {
            if (st.isFile()) {
              const source = tinify.fromFile(path.join(__dirname, `/source/`, stat))
              source.toFile(`./${stat}`)
            } else if (st.isDirectory()) {
              console.log('st', stat)
              loop(stat)
            }
          } else {
            console.error(2, err)
          }
        })
      })
    } else {
      console.error(100, errs)
    }
  })
}

loop()
