const Parse = require('./module/parse')
const Loader = require('./module/loader')

const m3u8File = './load.m3u8';
const cache_path = './cache'

;(async ()=>{
  const rs = await new Parse(m3u8File).parse();
  console.log(rs)
})()