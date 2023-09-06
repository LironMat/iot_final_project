const { dht, solarRadiation, windSpeed } = require('./models');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const { brokerUrl, parentTopic } = require('../sensors/common');
const { mongoUrl } = require('./db_commons');

mongoose.connect(mongoUrl).then(() => console.log('db connected!'));

const mqttClient = mqtt.connect(brokerUrl);

mqttClient.on('connect', () => {
  console.log('client connected');

  mqttClient.subscribe(`${parentTopic}/+`, (err) => {});
});

mqttClient.on('message', async (topic, message) => {
  console.log(`${topic} ${message.toString()}`);

  const msg = message.toString();
  const data = JSON.parse(msg);
  const tpc = topic.split('/').reverse()[0];

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
const app = express();
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
    default:
      return res.sendStatus(400);
  }

  const results = await model.find({ time: { $gt: subDays(new Date(), parseInt(req.params.days)) } }, { __v: 0, _id: 0 }).lean();

  return res.send(results);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
