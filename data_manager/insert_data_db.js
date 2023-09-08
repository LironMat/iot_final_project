const mongoose = require('mongoose');
const { mongoUrl } = require('./db_commons');
const { parse, isBefore, addSeconds, set } = require('date-fns');
const { noiseData, weatherDict } = require('../sensors/common');
const { dht, windSpeed, solarRadiation, et0 } = require('./models');

mongoose.connect(mongoUrl).then(async (db) => {
  // await dht.collection.drop();
  // await windSpeed.collection.drop();
  // await solarRadiation.collection.drop();
  // await et0.collection.drop();

  const now = new Date();

  // let start = parse('2023-08-01_00:00', 'yyyy-MM-dd_HH:mm', new Date());
  let start = (await dht.findOne().sort({ $natural: -1 })).time;

  while (isBefore(start, now)) {
    const startHour = set(start, { milliseconds: 0, seconds: 0, minutes: 0 });
    const hourlyData = weatherDict[startHour.getTime()];

    const d = new dht({
      time: start,
      humidity: noiseData(hourlyData.humidity),
      temperature: noiseData(hourlyData.temperature),
    }).save();

    const w = new windSpeed({
      time: start,
      windSpeed: noiseData(hourlyData.windSpeed),
    }).save();

    const s = new solarRadiation({
      time: start,
      solarRadiation: Math.max(0, noiseData(hourlyData.solarRadiation)),
    }).save();

    const e = new et0({
      time: start,
      et0: Math.max(0, noiseData(hourlyData.et0)),
    }).save();

    await Promise.all([d, w, s, e]);

    start = addSeconds(start, 10);

    console.log(start);
  }
});
