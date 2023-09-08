const { dht, solarRadiation, windSpeed, et0 } = require('./models');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const { brokerUrl, parentTopic, calculateET0 } = require('../sensors/common');
const { mongoUrl, saveDB } = require('./db_commons');

mongoose.connect(mongoUrl).then(() => console.log('db connected!'));

const mqttClient = mqtt.connect(brokerUrl);

mqttClient.on('connect', () => {
  console.log('client connected');

  mqttClient.subscribe(`${parentTopic}/+`, (err) => {});

  setInterval(async () => {
    const latestDht = await dht.findOne().sort({ $natural: -1 });
    const latestWindSpeed = await windSpeed.findOne().sort({ $natural: -1 });
    const latestSolarRadiation = await solarRadiation.findOne().sort({ $natural: -1 });

    const et0 = calculateET0(latestDht.temperature, latestDht.humidity, latestWindSpeed.windSpeed, latestSolarRadiation.solarRadiation);

    console.log(`et0: ${et0}`);

    mqttClient.publish('lm/iot/data/et0', JSON.stringify({ et0 }), { retain: true });
  }, 10 * 1000);
});

mqttClient.on('message', async (topic, message) => {
  console.log(`${topic} ${message.toString()}`);

  const msg = message.toString();
  const data = JSON.parse(msg);
  const tpc = topic.split('/').reverse()[0];

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
const { subDays } = require('date-fns');
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
