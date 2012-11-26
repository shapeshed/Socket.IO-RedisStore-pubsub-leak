var http = require('http'),
    express = require('express'),
    sio = require('socket.io'),
    fs = require('fs'),
    redis = require('redis'),
    exec = require('child_process').exec,
    report = fs.createWriteStream('./report.dat');

var app = express();
var server = http.createServer(app);
io = sio.listen(server);

io.set('transports', ['xhr-polling']);

var RedisStore = require('socket.io/lib/stores/redis'),
    pub = redis.createClient(),
    sub = redis.createClient(),
    cmd = redis.createClient();

io.set('store', new RedisStore({
  redisPub: pub,
  redisSub: sub,
  redisClient: cmd
}));

io.sockets.on('connection', function (socket) { });

server.listen(process.env.PORT || 3000);

server.on('error', function (err) {
  console.err(err);
});

/*
* Log connections and Redis pubsub channels to a file
* Used by gnuplot to graph data
*/
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
