// const Gpio = require('onoff').Gpio;
// const led1 = new Gpio(13,'out');
// const led2 = new Gpio(6,'out');
// const button = new Gpio(27,'in','both');
const http = require('http');
const path = require('path');
const publicPath = path.join(__dirname, '../public');
const port = 3000;
const socketIO = require('socket.io');
const moment = require('moment');
const timeProcessor = require('./timeProcessor');


const express = require('express');
const app = express();

const server = http.createServer((app));
const io = socketIO(server);

let relays = [];

relays.push({ relayID: 1, relayState: 0 });
relays.push({ relayID: 2, relayState: 0 });
relays.push({ relayID: 3, relayState: 0 });

let timeStore = [];
timeStore.push({ relayID: 1, relayState: 1, action: 'on', day: moment().day('Sunday'), time: moment().add(5, 'seconds') });
timeStore.push({ relayID: 1, relayState: 0, action: 'off', day: moment().day('Sunday'), time: moment().add(10, 'seconds') });
timeStore.push({ relayID: 2, relayState: 1, action: 'on', day: moment().day('Sunday'), time: moment().add(5, 'seconds') });
timeStore.push({ relayID: 2, relayState: 0, action: 'off', day: moment().day('Sunday'), time: moment().add(20, 'seconds') });



const timer = timeProcessor(timeStore);


const updateGPIO = () => {

  // led1.writeSync(relays[0].relayState);
  // led2.writeSync(relays[1].relayState);

  console.log(relays[0].relayState);
  console.log(relays[1].relayState);

  io.emit('stateUpdate', relays);
};

const setRelayState = (newRelayState) => {
    relays[relays.findIndex((obj) => { return obj.relayID === newRelayState.relayID })] = newRelayState;
}

app.use(express.static(publicPath));


timer.on('relayUpdate', (newRelayState) => {

  setRelayState(newRelayState);
  updateGPIO();
})

io.on('connection', (socket) => {
  console.log('new socket connection acquired');
  socket.emit('stateUpdate', relays);

  socket.on('updateRelay', (relayTransport, callback) => {
    // relays[relays.findIndex((obj) => { return obj.relayID === relayTransport.relayID })] = relayTransport;

    setRelayState(relayTransport);

    updateGPIO();
  });

  socket.on('disconnect', () => {
    console.log('socket connection disconnected');
  });
});

// button.watch(function(err, value){
// 	console.log(value);

// 	led.writeSync(value ^= 1);
// });


process.on('SIGINT', function () {
  led.unexport();
  button.unexport();
});
console.log('process running');

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
