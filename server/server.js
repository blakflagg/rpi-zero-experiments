const Gpio = require('onoff').Gpio;
const led1 = new Gpio(13,'out');
const led2 = new Gpio(6,'out');
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

let relayState = {
  relay1: 0,
  relay2: 0,
  relay3: 0
}

const updateGPIO = () => {

  led1.writeSync(relayState.relay1);
  led2.writeSync(relayState.relay2);
};
app.use(express.static(publicPath));


io.on('connection',(socket) => {
  console.log('new socket connection acquired');
  socket.emit('stateUpdate',relayState);

  socket.on('updateRelay', (relayTransport) => {
    console.log(relayTransport);
    switch(relayTransport.relay){
      case 1:
        relayState.relay1 = relayTransport.value;
        break;
      case 2:
        relayState.relay2 = relayTransport.value;
        break;
      case 3:
        relayState.relay3 = relayTransport.value;
        break;
    }
    updateGPIO();
    io.emit('stateUpdate', relayState);

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
