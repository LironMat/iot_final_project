const mongoUrl = 'mongodb://root:example@localhost:27017/iot?authSource=admin';

const { dht, solarRadiation, windSpeed } = require('./models');
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const { brokerUrl, parentTopic } = require('../sensors/common');

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
