const { set } = require('date-fns');
const { parentTopic, updateRateMs, brokerUrl, weatherDict, noiseData, delay } = require('./common');

const mqtt = require('mqtt');
const client = mqtt.connect(brokerUrl);

const topic = `${parentTopic}/sensors/wind_speed`;

client.on('connect', async () => {
  await delay(Math.random() * 5000);

  console.log('client connected');

  setInterval(async () => {
    const nowHour = set(new Date(), { milliseconds: 0, seconds: 0, minutes: 0 });
    const hourlyData = weatherDict[nowHour.getTime()];
    const currentData = {
      windSpeed: noiseData(hourlyData.windSpeed),
    };

    console.log(currentData);

    client.publish(topic, JSON.stringify(currentData), { retain: true });
  }, updateRateMs);
});
