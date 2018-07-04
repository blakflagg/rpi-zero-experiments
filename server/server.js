// const Gpio = require('onoff').Gpio;
// const led1 = new Gpio(13,'out');
// const led2 = new Gpio(6,'out');
// const led3 = new Gpio(5,'out');
// const button = new Gpio(27,'in','both');
const http = require('http');
const path = require('path');
const publicPath = path.join(__dirname, '../public');
const port = 3000;
const socketIO = require('socket.io');
const uuid = require('uuid/v4');
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
const addTimeEntry = (timeEntry) => {
  timeEntry.id = uuid();
  timeStore.push(timeEntry);
  console.log(timeStore);
}

const deleteTimeEntry = (id) => {

    timeStore[timeStore.findIndex((obj) => { return obj.id === id })].remove;
}

addTimeEntry({ 
  relayID: 1,
  relayState: 1, 
  time: { 
    day: 3,
    hour: 10,
    minute: 3,
    seconds: 10
  }});

addTimeEntry({ 
  relayID: 1,
  relayState: 0, 
  time: { 
    day: 3,
    hour: 10,
    minute: 3,
    seconds: 15
  }});

const timer = timeProcessor.timeProcessor(timeStore);



const updateGPIO = () => {

  // led1.writeSync(relays[0].relayState);
  // led2.writeSync(relays[1].relayState);
  // led3.writeSync(relays[2].relayState);

  // console.log(relays[0].relayState);
  // console.log(relays[1].relayState);

  io.emit('stateUpdate', relays);
};

const setRelayState = (newRelayState) => {
  newRelayState.map((relay) => {

    relays[relays.findIndex((obj) => { return obj.relayID === relay.relayID })] = relay;
  })
}
const timerListener = (newRelayState) => {

  setRelayState(newRelayState);
  updateGPIO();
}
app.use(express.static(publicPath));


timer.on('relayUpdate', timerListener);



io.on('connection', (socket) => {
  console.log('new socket connection acquired');
  socket.emit('stateUpdate', relays);

  socket.on('addTimeEntry', (relayTransport, callback) => {
    relayTransport.map((timeEntry) => {
      addTimeEntry(timeEntry);
    })
  });

  socket.on('deleteTimeEntry', (timeEntryID, callback) => {
    deleteTimeEntry(timeEntryID);
  })

  socket.on('updateRelay', (relayTransport, callback) => {
    const newRelayState = [];
    newRelayState.push(relayTransport);
    setRelayState(newRelayState);
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
  timer.removeListener('relayUpdate', timerListener);
  timeProcessor.clearTimer();
  // led1.unexport();
  // led2.unexport();
  // led3.unexport();
  // button.unexport();
  server.close();
  process.exit(0);
});
console.log('process running');

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
