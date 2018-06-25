const Gpio = require('onoff').Gpio;
const led = new Gpio(13,'out');
const button = new Gpio(27,'in','both');
const http = require('http');
const path = require('path');
const publicPath = path.join(__dirname,'../public');
const port = 3000;
const socketIO = require('socket.io');

const express = require('express');
const app = express();

const server = http.createServer((app));
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('new socket connection acquired');
  socket.on('updateRelay', (relayTransport) => {
    console.log(relayTransport);
    switch(relayTransport.relay){
      case 1:
        led.writeSync(relayTransport.value);
    }
  });
  socket.on('disconnect',() => {
    console.log('socket connection disconnected');
  });
});

// button.watch(function(err, value){
// 	console.log(value);

// 	led.writeSync(value ^= 1);
// });


process.on('SIGINT', function(){
	led.unexport();
	button.unexport();
});
console.log('process running');

server.listen(port,() =>{
  console.log(`Server is up on ${port}`);
});
