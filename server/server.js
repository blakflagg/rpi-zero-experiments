// const Gpio = require('onoff').Gpio;
// const led1 = new Gpio(13,'out');
// const led2 = new Gpio(6,'out');
// const button = new Gpio(27,'in','both');
const http = require('http');
const path = require('path');
const publicPath = path.join(__dirname,'../public');
const port = 3000;
const socketIO = require('socket.io');
const moment = require('moment');

const express = require('express');
const app = express();

const server = http.createServer((app));
const io = socketIO(server);

let relays = [];

relays.push({relayID: 1, relayState: 0});
relays.push({relayID: 2, relayState: 0});
relays.push({relayID: 3, relayState: 0});

let timeStore = [];
timeStore.push({relayID: 1, relayState: 1, action: 'on', day:'Monday', time:moment().add(10,'seconds')});
timeStore.push({relayID: 1, relayState: 0, action: 'off', day:'Monday', time:moment().add(20,'seconds')});

setInterval(() =>{
  timeStore.map((timeEntry) => {
    var cTime = moment(timeEntry.time).valueOf().toString();
    if(moment().valueOf().toString().slice(0,-3) === cTime.slice(0,-3)){

    console.log(`Relay: ${timeEntry.relayID} ${timeEntry.action} at Time: ${cTime.slice(0,-4)}`);
    newRelayState = Object.assign({}, {relayID: timeEntry.relayID, relayState: timeEntry.relayState})
    relays[relays.findIndex((obj) => {return obj.relayID === newRelayState.relayID})] = newRelayState;
    updateGPIO();
    }
  })
},1000)

const updateGPIO = () => {

  // led1.writeSync(relays[0].relayState);
  // led2.writeSync(relays[1].relayState);

  console.log(relays[0].relayState);
  console.log(relays[0].relayState);
  
};
app.use(express.static(publicPath));


io.on('connection',(socket) => {
  console.log('new socket connection acquired');
  socket.emit('stateUpdate',relays);

  socket.on('updateRelay', (relayTransport,callback) => {
    relays[relays.findIndex((obj) => {return obj.relayID === relayTransport.relayID})] = relayTransport;
    console.log(moment().format('LLLL'));
    updateGPIO();
    io.emit('stateUpdate', relays);

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
