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

const et0 = mongoose.model(
  'ET0',
  new mongoose.Schema({
    time: { type: Date, default: Date.now },
    et0: { type: Number },
  })
);

const faucetToggle = mongoose.model(
  'FaucetToggle',
  new mongoose.Schema({
    time: { type: Date, default: Date.now },
    status: { type: Boolean },
  })
);

module.exports = { dht, solarRadiation, windSpeed, et0, faucetToggle };
