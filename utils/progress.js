const Progress = function Progress(m) {
  this.str = ''
  this.len = 0
  this.maxLen = m
  this.flag = 'add'
  this.isDone = false
}

Progress.prototype.add = function() {
  if (this.isFull()) {
    this.flag = "minues";
    this.reduce()
    return
  }
  this.flag = 'add'
  this.len+=1
  this.str += ` =`;
  console.log(this.str)
}

Progress.prototype.reduce = function() {
  if (this.isEmpty()) {
    this.flag = "add";
    this.add()
    return
  }
  this.flag = 'minues'
  this.len-=1
  this.str = this.str.substring(0, this.str.length - 2)
  console.log(this.str)
}

Progress.prototype.init = function() {
  if (this.isEmpty() || this.flag === 'add') {
    this.add()
  } else {
    this.reduce()
  }
}

Progress.prototype.isFull = function() {
  return this.len === this.maxLen
}

Progress.prototype.isEmpty = function() {
  return this.len <= 1
}

module.exports = new Progress()