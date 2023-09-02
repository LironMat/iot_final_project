const mongoose = require('mongoose');

const dht = mongoose.model(
  'DHT',
  new mongoose.Schema({
    time: { type: Date, default: Date.now },
    temperature: { type: Number },
    humidity: { type: Number },
  })
);

const solarRadiation = mongoose.model(
  'SolarRadiation',
  new mongoose.Schema({
    time: { type: Date, default: Date.now },
    solarRadiation: { type: Number },
  })
);

const windSpeed = mongoose.model(
  'WindSpeed',
  new mongoose.Schema({
    time: { type: Date, default: Date.now },
    windSpeed: { type: Number },
  })
);

module.exports = { dht, solarRadiation, windSpeed };
