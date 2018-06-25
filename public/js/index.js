let rVal1 = 0;


var socket = io();
socket.on('connect', function(){
  console.log('connected to server');
});

var relay1 = jQuery('#relay1');

relay1.on('click', function (){
  socket.emit('updateRelay', {
    relay: 1,
    value: rVal1 ^= 1
  })
});