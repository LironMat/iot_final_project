const brokerUrl = 'mqtt://broker.hivemq.com';
const updateRateMs = 5 * 1000;
const topic = 'lm/iot/plant/wind_speed';

const mqtt = require('mqtt');
const client = mqtt.connect(brokerUrl);
const fs = require('fs');
const { set } = require('date-fns');

const weatherDict = JSON.parse(fs.readFileSync(`${__dirname}/../fake_data/weatherData.json`, { encoding: 'utf-8' }));

function noiseData(data) {
  const res = data + Math.random() - 0.5;

  return Math.floor(res * 100) / 100;
}

client.on('connect', () => {
  console.log('client connected');

  setInterval(async () => {
    const nowHour = set(new Date(), { milliseconds: 0, seconds: 0, minutes: 0 });
    const hourlyData = weatherDict[nowHour.getTime()];
    const currentData = {
      windSpeed: noiseData(hourlyData.windSpeed),
    };

    console.log(currentData);

    client.publish(topic, JSON.stringify(currentData));
  }, updateRateMs);
});
