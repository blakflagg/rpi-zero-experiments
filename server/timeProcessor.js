
const emitter = require('events').EventEmitter;
const moment = require('moment');

module.exports = timeProcessor = (ts) => {
  const e = new emitter();
  let updateBuffer = [];
  let isUpdate = false;

  setInterval(() => {

    ts.map((timeEntry) => {
      var cTime = moment(timeEntry.time).valueOf().toString();
      var scheduledDay = moment(timeEntry.day).day();
      var scheduledHour = moment(timeEntry.time).hour();
      var scheduledMin = moment(timeEntry.time).minute();
      var scheduledSecond = moment(timeEntry.time).second();

      var day = moment().day();
      var hour = moment().hour();
      var minute = moment().minute();
      var second = moment().second();

      //console.log(`${day} ${hour} ${minute} ${second}`);
      //console.log(`${scheduledDay} ${scheduledHour} ${scheduledMin} ${scheduledSecond}`);


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
