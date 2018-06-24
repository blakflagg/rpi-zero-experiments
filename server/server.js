const Gpio = require('onoff').Gpio;
const led = new Gpio(13,'out');
const button = new Gpio(27,'in','both');

button.watch(function(err, value){
	console.log(value);

	led.writeSync(value ^= 1);
});

process.on('SIGINT', function(){
	led.unexport();
	button.unexport();
});
console.log('process running');
