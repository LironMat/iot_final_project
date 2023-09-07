const fs = require('fs');

//const brokerUrl = 'mqtt://broker.hivemq.com';

const brokerUrl = 'mqtt://localhost:1883';
const updateRateMs = 10 * 1000;
const parentTopic = 'lm/iot/sensors';

/** @type {Object.<number,{temperature:number,humidity:number,windSpeed:number,solarRadiation:number,et0:number}>} */
const weatherDict = JSON.parse(fs.readFileSync(`${__dirname}/../fake_data/weatherData.json`, { encoding: 'utf-8' }));

function noiseData(data) {
  if (data === 0) {
    return 0;
  }

  const res = data + Math.random() - 0.5;

  return Math.floor(res * 100) / 100;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateET0(temperature, relativeHumidity, windSpeed, Rs, elevation = 31.0, dewpoint = 19.6) {
  // Constants
  /// Slope of saturation vapour pressure curve at air temperature T [kPa °C-1], (Page 37)
  let β = 17.27; // Actaually 17.625 is now recommended. FAO uses the old one.
  let λ = 237.3; // 243.04 new recommendation
  let vaporPressurCurveSlope = (4098 * (0.6108 * Math.exp((β * temperature) / (temperature + λ)))) / Math.pow(temperature + λ, 2);

  let factorFrom = 4.87 / Math.log(67.8 * 10 - 5.42);
  let factorTo = 4.87 / Math.log(67.8 * 2 - 5.42);

  let windSpeed2m = (factorFrom / factorTo) * (windSpeed * (5 / 18));

  /// Air pressure in kPa. Evaporation at high altitudes is promoted due to low atmospheric pressure as expressed in the psychrometric constant. The effect is, however, small and in the calculation procedures, the average value for a location is sufficient.
  let simplifiedAtmosphericPressure = 101.3 * Math.pow((293 - 0.0065 * elevation) / 293.0, 5.26);

  /// psychrometric constant [kPa °C-1], (Equation 8)
  let γ = 0.000665 * simplifiedAtmosphericPressure;

  /// saturation vapor pressure at air temperature Thr. (kPa)
  let esat = 0.6108 * Math.exp((β * temperature) / (temperature + λ));

  /// actual vapour pressure [kPa], (Page 37)
  let ea = 0.6108 * Math.exp((β * dewpoint) / (dewpoint + λ));

  let vaporPressureDeficit = esat - ea;

  /// 0.23 is defined by FAO for albedo
  let albedo = 0.23;

  /// net solar or shortwave radiation [MJ m-2 day-1], (Page 51)
  let Rns = (Rs * (1 - albedo) * 0.0864) / 24;

  /// As a more approximate alternative, one can assume Rs/Rso = 0.4 to 0.6 during nighttime periods in humid and subhumid climates and Rs/Rso = 0.7 to 0.8 in arid and semiarid climates. (Page 75)
  let RrelAproximation = 0.4 + (relativeHumidity / 100) * 0.4;

  /// relative shortwave radiation (limited to ≤ 1.0
  let Rrel = RrelAproximation;

  /// net outgoing longwave radiation [MJ m-2 day-1]
  let Rnl = 0.20429166e-9 * Math.pow(temperature + 273.16, 4) * (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * Rrel - 0.35);

  // radiation balance
  let Rn = Rns - Rnl;

  /// soil heat flux [MJ m-2 day-1], During night, calculation is different
  let Ghr = Rs <= 0 ? 0.5 * Rn : 0.1 * Rn;

  // evapotranspiration
  let et0 = (0.408 * vaporPressurCurveSlope * (Rn - Ghr) + γ * (37.0 / (temperature + 273)) * windSpeed2m * vaporPressureDeficit) / (vaporPressurCurveSlope + γ * (1 + 0.34 * windSpeed2m));

  return Math.max(Math.floor(et0 * 100) / 100, 0);
}

module.exports = { brokerUrl, updateRateMs, parentTopic, weatherDict, noiseData, delay, calculateET0 };
