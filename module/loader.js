const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * ts分片加载器
 */
class Loader {
  /**
   * 
   * @param {String} url 分片url
   * @param {Object} option 加载配置
   */
  constructor(url,{name = '', dir = ''} = {} ){
    this.url = url;
    if(!name){
      // 如果名字不传入，则通过url获取裁剪
      this.name = this.url.split('/').pop()
    }
    this.dir = dir;
  }
  async load(){
    const rs = await axios.get(this.url,{responseType: 'stream'});
    rs.data.pipe(fs.createWriteStream(this.savePath))
  }
  get savePath(){
    return path.resolve(this.dir,this.name);
  }
}

// let load = new Loader('https://youku.cdn-56.com/20180314/u52NEU9I/800kb/hls/ciBWT2939000.ts');
// console.log(load.load())

module.exports = Loader;