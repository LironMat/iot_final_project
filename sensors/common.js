const fs = require('fs');

//const brokerUrl = 'mqtt://broker.hivemq.com';

const brokerUrl = 'mqtt://localhost:1883';
const updateRateMs = 10 * 1000;
const parentTopic = 'lm/iot/plant';
const weatherDict = JSON.parse(fs.readFileSync(`${__dirname}/../fake_data/weatherData.json`, { encoding: 'utf-8' }));

function noiseData(data) {
  const res = data + Math.random() - 0.5;

  return Math.floor(res * 100) / 100;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { brokerUrl, updateRateMs, parentTopic, weatherDict, noiseData, delay };
