function a() {
  console.log(1);
}
void a();

const moment = require('moment');
const currentDate = moment().format('DD/MM/YYYY');
const startTime = '3:10';
const endTime = '1:20';
const startDate = moment(`${currentDate} ${startTime}`, 'DD/MM/YYYY mm:ss');
const endDate = moment(`${currentDate} ${endTime}`, 'DD/MM/YYYY mm:ss');
if (endTime < startTime) {
  endDate.add(1, 'days');
}
const startDateMillis = startDate.valueOf();
const endDateMillis = endDate.valueOf();

console.log('Start time in milliseconds:', startDateMillis);
console.log('End time in milliseconds:', endDateMillis);

process.on('exit', function() { console.log(22)});
throw "ERR"