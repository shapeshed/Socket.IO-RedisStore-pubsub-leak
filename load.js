var io = require('socket.io-client');

/**
* Set Maximum number of desired connections here
*/
var MAX_CONNECTIONS = 100;

/**
* Counters used in load test
*/
var conns = 0;
var i = 0;

/**
* Socket.IO options
*/
var socketIO = {
  options: { 
    transports: ['xhr-polling'],
    'force new connection': true 
  }
};

/**
* Connect a bot to the Socket.IO server
*/
var connectSocket = function (i){
  if (conns === MAX_CONNECTIONS) {
    console.log('load test finished');
    process.exit(0);
  }
  var socket = io.connect('http://0.0.0.0:3000', socketIO.options);
  socket.on('connect',function() {
    conns++;
    console.log('Connected Bot ' + i + '. Connections: ' + conns);
  });
  socket.on('error',function(data) {
    console.log('Error! ' + data);
  });
  socket.on('disconnect',function() {
    conns--;
    console.log('Disconnected Bot ' + i + '. Connections: ' + conns);
  });  
  return;
}

/**
* Connect a bot every second
*/
var interval = setInterval(function(){ connectSocket(i++)}, 1000);



