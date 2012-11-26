var cluster = require('cluster');

var workers = process.env.WORKERS || require('os').cpus().length;

if (cluster.isMaster) {

  console.log('start cluster with %s workers', workers);

  for (var i = 0; i < workers; ++i) {
    var worker = cluster.fork().process;
    console.log('worker %s started.', worker.pid);
  }

  cluster.on('exit', function(worker) {
    console.log(worker.process.exitCode);
    console.log('worker %s died. restart...', worker.process.pid);
    cluster.fork();
  });

} else {

  var http = require('http'),
      express = require('express'),
      sio = require('socket.io'),
      fs = require('fs'),
      exec = require('child_process').exec;
      redis = require('redis'),
      pub = redis.createClient(),
      sub = redis.createClient(),
      cmd = redis.createClient(),
      RedisStore = require('socket.io/lib/stores/redis')
      report = fs.createWriteStream('./report.' + cluster.worker.id + '.dat');

  var app = express();
  var server = http.createServer(app);
  io = sio.listen(server);

  io.set('transports', ['xhr-polling']);

  io.set('store', new RedisStore({
    redis: redis,
    redisPub: pub,
    redisSub: sub,
    redisClient: cmd
  }));

  io.sockets.on('connection', function (socket) {});

  server.listen(process.env.PORT || 3000);
  
  server.on('error', function (err) {
    console.err(err);
  });

  var seconds = 0;
  function logPubSub() {
    var child = exec('redis-cli info | grep pubsub_channels | sed s/pubsub_channels://', function (err, stdout, stderr) {
      if (err) { throw err };
      report.write(seconds++ + '\t' + io.sockets.clients().length + '\t' + stdout);
    });
  }

  /**
  * Log stats every second
  */
  var logger = setInterval(function(){logPubSub()}, 1000);

}
