
const emitter = require('events').EventEmitter;
const moment = require('moment');

let timeOut;
 const timeProcessor = (ts) => {
  const e = new emitter();
  let updateBuffer = [];
  let isUpdate = false;

  timeOut = setInterval(() => {

    ts.map((timeEntry) => {
      //var cTime = moment(timeEntry.time).valueOf().toString();
      var scheduledDay = timeEntry.time.day;
      var scheduledHour = timeEntry.time.hour;
      var scheduledMin = timeEntry.time.minute;
      var scheduledSecond = timeEntry.time.seconds;

      var day = moment().day();
      var hour = moment().hour();
      var minute = moment().minute();
      var second = moment().second();

      // console.log(`${day} ${hour} ${minute} ${second}`);
      // console.log(`${scheduledDay} ${scheduledHour} ${scheduledMin} ${scheduledSecond}`);


      if (day === scheduledDay) {

        if (hour === scheduledHour) {

          if (minute === scheduledMin) {

            if (second === scheduledSecond) {
              updateBuffer.push({ relayID: timeEntry.relayID, relayState: timeEntry.relayState });
            }

          }
        }
      }
    })
    // console.log(updateBuffer);
    if (updateBuffer.length > 0) {
      e.emit('relayUpdate', updateBuffer);
      updateBuffer = [];
    }

  }, 1000)

  return e;
}

const clearTimer = () => {

  clearInterval(timeOut);
}

module.exports = {timeProcessor, clearTimer};