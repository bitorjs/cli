var cluster = require('cluster');
var http = require('http');



console.log('[worker] ' + "start worker" + cluster.worker.id, cluster.isWorker);


let server = http.createServer(function (req, res) {

  res.writeHead(200, {
    "content-type": "text/html"
  });
  res.end('worker' + cluster.worker.id + ',PID:' + process.pid);
}).listen(3000);
