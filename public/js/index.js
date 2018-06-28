let relayState = {
  relay1: 0,
  relay2: 0,
  relay3: 0
}
var relay1 = jQuery('#relay1');
var relay2 = jQuery('#relay2');
var relay3 = jQuery('#relay3');

var socket = io();
socket.on('connect', function(){
  console.log('connected to server');
});

socket.on('disconnect', () =>{
  console.log('disconnected from server');
});

socket.on('stateUpdate', (state) =>{
  console.log(state);
  relayState.relay1 = state.relay1;
  relayState.relay2 = state.relay2;
  relayState.relay3 = state.relay3;
  updateSwitchState();
});
const updateSwitchState = () => {

  relay1.prop('checked',relayState.relay1);
  relay2.prop('checked',relayState.relay2);
  relay3.prop('checked',relayState.relay3);
}


relay1.on('click', function (){
  socket.emit('updateRelay', {
    relay: 1,
    value: relayState.relay1 ^= 1
  })
});

relay2.on('click', function (){
  socket.emit('updateRelay', {
    relay: 2,
    value: relayState.relay2 ^= 1
  })
});

relay3.on('click', function (){
  socket.emit('updateRelay', {
    relay: 3,
    value: relayState.relay3 ^= 1
  })
});