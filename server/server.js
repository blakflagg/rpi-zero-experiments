const Gpio = require('onoff').Gpio;
const led = new Gpio(13,'out');
const button = new Gpio(27,'in','both');
const http = require('http');
const path = require('path');
const publicPath = path.join(__dirname,'../public');
const port = 3000;

const express = require('express');
const app = express();

const server = http.createServer((app));

app.use(express.static(publicPath));


button.watch(function(err, value){
	console.log(value);

	led.writeSync(value ^= 1);
});


process.on('SIGINT', function(){
	led.unexport();
	button.unexport();
});
console.log('process running');

server.listen(port,() =>{
  console.log(`Server is up on ${port}`);
});
