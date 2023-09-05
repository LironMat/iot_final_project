const mongoose = require('mongoose');
const { mongoUrl } = require('./db_commons');
const { parse, isBefore, addSeconds, set } = require('date-fns');
const { noiseData, weatherDict } = require('../sensors/common');
const { dht, windSpeed, solarRadiation } = require('./models');

mongoose.connect(mongoUrl).then(async (db) => {
  const now = new Date();
  let start = parse('2023-08-01_00:00', 'yyyy-MM-dd_HH:mm', new Date());

  while (isBefore(start, now)) {
    const startHour = set(start, { milliseconds: 0, seconds: 0, minutes: 0 });
    const hourlyData = weatherDict[startHour.getTime()];

    await new dht({
      time: start,
      humidity: noiseData(hourlyData.humidity),
      temperature: noiseData(hourlyData.temperature),
    }).save();

    await new windSpeed({
      time: start,
      windSpeed: noiseData(hourlyData.windSpeed),
    }).save();

    await new solarRadiation({
      time: start,
      solarRadiation: Math.max(0, noiseData(hourlyData.solarRadiation)),
    }).save();

    start = addSeconds(start, 10);

    console.log(start);
  }
});