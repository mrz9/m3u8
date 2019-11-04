// 解析m3u8文件，获取ts分片队列
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class Parse {
  constructor(file) {
    this.queue = []
    this.file = file;
  }
  async parse() {
    return new Promise((resolve,reject)=>{
      let inputStream = fs.createReadStream(this.file);
      let lineReader = readline.createInterface({ input: inputStream });
      lineReader.on('line', line => {
        if(!line.startsWith('#')){
          this.queue.push(line);
        }
      }).on('close',()=>{
        resolve(this.queue)
      });
    })
  }
}

// new Parse(path.resolve('../','load.m3u8'))
module.exports = Parse;