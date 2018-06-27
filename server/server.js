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

let relays = [];

relays.push({relayID: 1, relayState: 0});
relays.push({relayID: 2, relayState: 0});
relays.push({relayID: 3, relayState: 0});


const updateGPIO = () => {

  led1.writeSync(relays[0].relayState);
  led2.writeSync(relays[1].relayState);
};
app.use(express.static(publicPath));


io.on('connection',(socket) => {
  console.log('new socket connection acquired');
  socket.emit('stateUpdate',relays);

  socket.on('updateRelay', (relayTransport,callback) => {
    console.log(relayTransport);
    relays[relayTransport.relayID - 1] = relayTransport;
    console.log(relays);

    updateGPIO();
    io.emit('stateUpdate', relays);
    callback();

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
