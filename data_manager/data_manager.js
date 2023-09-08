const { dht, solarRadiation, windSpeed, et0, faucetToggle } = require('./models');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const { brokerUrl, parentTopic, calculateET0 } = require('../sensors/common');
const { mongoUrl, saveDB } = require('./db_commons');

mongoose.connect(mongoUrl).then(() => console.log('db connected!'));

const mqttClient = mqtt.connect(brokerUrl);

async function calculateET0FromLatestData(latestDht, latestWindSpeed, latestSolarRadiation) {
  const et0 = calculateET0(latestDht.temperature, latestDht.humidity, latestWindSpeed.windSpeed, latestSolarRadiation.solarRadiation);

  console.log(`et0: ${et0}`);

  mqttClient.publish(`${parentTopic}/data/et0`, JSON.stringify({ et0 }), { retain: true });
}

mqttClient.on('connect', () => {
  mqttClient.subscribe(`${parentTopic}/sensors/+`, (err) => {});
  mqttClient.subscribe(`${parentTopic}/faucet`, (err) => {});

  setInterval(async () => {
    const [latestDht, latestWindSpeed, latestSolarRadiation, latestFaucetStatus] = await Promise.all([
      dht.findOne().sort({ $natural: -1 }),
      windSpeed.findOne().sort({ $natural: -1 }),
      solarRadiation.findOne().sort({ $natural: -1 }),
      faucetToggle.findOne().sort({ $natural: -1 }),
    ]);

    await calculateET0FromLatestData(latestDht, latestWindSpeed, latestSolarRadiation);

    const warnings = [];

    if (latestFaucetStatus.status && latestSolarRadiation.solarRadiation > 0) {
      warnings.push('ברז ההשקייה פתוח כשבחוץ חם מדי, יש לסגור ולפתוח רק בשעות לילה');
    }

    if (latestFaucetStatus.status && isBefore(latestFaucetStatus.time, subMinutes(new Date(), 30))) {
      warnings.push('ברז ההשקייה פתוח יותר מ30 דקות, יש לסגור אותו על מנת לחסוך במים');
    }

    mqttClient.publish(`${parentTopic}/warn`, JSON.stringify(warnings));
  }, 10 * 1000);
});

mqttClient.on('message', async (topic, message) => {
  console.log(`${topic} ${message.toString()}`);

  const msg = message.toString();
  const data = JSON.parse(msg);
  const tpc = topic.split('/').reverse()[0];

  if (tpc === 'faucet') {
    await new faucetToggle({ status: data === 'on' }).save();

    return;
  }

  if (!saveDB) {
    return;
  }

  switch (tpc) {
    case 'dht':
      await new dht(data).save();
      break;
    case 'solar_radiation':
      await new solarRadiation(data).save();
      break;
    case 'wind_speed':
      await new windSpeed(data).save();
      break;
    default:
      console.warn('unknown topic');
  }
});

const express = require('express');
const { subDays, isBefore, subMinutes } = require('date-fns');
var cors = require('cors');
const app = express();

app.use(cors());

const port = 3000;

app.get('/sensor_data/:sensor/:days', async (req, res) => {
  let model = null;
  switch (req.params.sensor) {
    case 'dht':
      model = dht;
      break;
    case 'wind_speed':
      model = windSpeed;
      break;
    case 'solar_radiation':
      model = solarRadiation;
      break;
    case 'et0':
      model = et0;
      break;
    default:
      return res.sendStatus(400);
  }

  const results = await model.find({ time: { $gt: subDays(new Date(), parseInt(req.params.days)) } }, { __v: 0, _id: 0 }).lean();

  return res.send(results);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
