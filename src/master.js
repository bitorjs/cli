var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

console.log('[master] ' + "start master...", cluster.isMaster);

// var filename = require('path').resolve(process.argv[0])
// var requirename = require.resolve(filename)

// console.log(process.argv[2])
cluster.setupMaster({
  exec:'./src/worker.js',//require('path').join(process.cwd(), process.argv[2]),
  // execArgv: ['--harmony'],
  // args: [requirename],
})

cluster.on('setup', function (worker) {
  console.log('[master] '+'have setup worker'+worker);
})

cluster.on('fork', function (worker) {
  console.log('[master] ' + 'fork: worker' + worker.id);
});

cluster.on('online', function (worker) {
  console.log('[master] ' + 'online: worker' + worker.id);
});

cluster.on('listening', function (worker, address) {
  console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
});

cluster.on('disconnect', function (worker) {
  console.log('[master] ' + 'disconnect: worker' + worker.id);
});

cluster.on('error', function (worker,err,a) {
  console.log('worker ' + worker.id + ' error', err);
})

cluster.on('exit', function (worker, code, signal) {
  console.log('[master] ' + 'exit worker' + worker.id + ' died');
});

cluster.on('message', function (worker, message, handle) {
  console.log('[master] ' + worker.id + ' message ' + message);
})


process.on('SIGTERM', (code)=>{
  console.log('sig SIGTERM')
  closeAgent(code)
})
process.on('SIGINT', (code)=>{
  console.log('sig SIGINT')
  closeAgent(code)
})

process.on('SIGTSTP', (code)=>{
  console.log('sig SIGTSTP')
  closeAgent(code)
  return 1;
})

process.on('SIGCONT', (code)=>{
  console.log('sig SIGCONT')
  closeAgent(code)
})

// process.on('SIGKILL', (code)=>{
//   console.log("sig kill")
//   closeAgent(code)
// })

process.on('uncaughtException', function (err) {
  console.error("[master] uncaght exception",err.stack)
  closeAgent("SIGINT")
})
process.on('exit', function () {
  console.log('exiting master')
})

function closeAgent(code){

  Object.keys(cluster.workers).forEach(id=>{
    
    let worker = cluster.workers[id]
    // console.log('kill ....', worker)
    worker.disconnect()

    // process.kill(worker.process.pid,0)
    worker.kill(0)
    worker.kill('SIGKILL')

    
  })


  // var killtimer = setTimeout(function () {
    process.exit(0)
  // }, 1000)

  // // http://nodejs.org/api/timers.html#timers_unref
  // killtimer.unref()

  // 
}

for (var i = 0; i < numCPUs; i++) {
  let worker = cluster.fork();


  worker.process.on('message', function (msg) {
    console.log('[worker] message from Master:' + msg);
  });

  worker.process.on('SIGTERM', function () {
    close(0, worker)
  })

  worker.process.on('SIGINT', function () {
    close(0, worker)
  })

  worker.process.on('SIGTSTP', (code)=>{
    close(0, worker)
  })

  worker.process.on('SIGKILL', (code)=>{
    console.log('[worker]',worker.id, 'sigkill')
    close(0, worker)
  })

  worker.process.on('uncaughtException', function (err) {
    console.error(err.stack)
    close(1, worker)
  })
  worker.process.on('exit', function () {
    console.log('exiting worker %s', worker.id)
  })


  function close(code, worker){
    // to do: make this an option
    // var killtimer = setTimeout(function () {
      worker.process.exit(code)
    // }, 1000)

    // http://nodejs.org/api/timers.html#timers_unref
    // killtimer.unref()
    // server.close()
    worker.disconnect()
    console.log('[worker]',worker.id, 'sigkill')
  }

}