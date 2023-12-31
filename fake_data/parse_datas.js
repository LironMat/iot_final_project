const fs = require('fs');

function parseRawWeatherData() {
  const txt = fs.readFileSync(`${__dirname}/raw_weather_data.csv`, { encoding: 'utf-8' });
  const lines = txt.split('\n').map((l) => {
    const splt = l.split(',');

    return { d: new Date(splt[0]), t: parseFloat(splt[1]), h: parseInt(splt[2]), e: parseFloat(splt[3]), w: parseFloat(splt[4]), r: parseFloat(splt[5]) };
  });

  const data = {};

  lines.forEach((l) => {
    data[l.d.getTime()] = { temperature: l.t, humidity: l.h, windSpeed: l.w, solarRadiation: l.r, et0: l.e };
  });

  fs.writeFileSync(`${__dirname}/weatherData.json`, JSON.stringify(data), { encoding: 'utf-8' });
}

parseRawWeatherData();
