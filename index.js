const Parse = require('./module/parse')
const {spawn} = require('child_process');

const m3u8File = './load.m3u8';

// 并发数量
const CHILD_PROCESS_MAX = 3;

const BADE_URL = 'https://youku.cdn-56.com/20180314/u52NEU9I/800kb/hls/';

;(async ()=>{
  // 资源队列
  const watting_queue = await new Parse(m3u8File).parse();
  console.log('wating_queue length', watting_queue.length)
  // 正在加载队列
  const loading_queue = [];
  // 成功队列
  const success_queue = [];
  // 失败队列
  const error_queue = [];

  for(let i = 0; i < CHILD_PROCESS_MAX; i++) {
    const child = spawn('node',['worker.js'], { stdio: [null, null, null, 'ipc']});
    // code: 0 success, -1: error 
    child.on('message',({code, item})=>{
      if(code == 0) {
        success_queue.push(item);
      }else {
        error_queue.push(item);
      }

      if(success_queue.length < 10 && watting_queue.length){
        child.send({
          code: 0,
          base_url:BADE_URL,
          item:watting_queue.shift()
        });

      }else {
        child.send({
          code: 1
        });
      }
    })
    child.on('exit', (code, signal)=>{
      console.log(`child process #${i} exited with code ${code} and signal ${signal}`);
      console.log(`error: ${error_queue.length}; success: ${success_queue.length}`)
    })

    child.on('error',e=>{
      console.log(`child error: ${i}`,e)
    })

    child.send({
      code: 0,
      base_url:BADE_URL,
      item:watting_queue.shift()
    });
  }
})()