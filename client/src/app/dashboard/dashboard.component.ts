import { Component } from '@angular/core';
import { CurrentSensorData } from '../models/current-sensor-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  readonly projectParentTopic = `lm/iot`;
  readonly sensorParentTopic = `${this.projectParentTopic}/sensors`;

  readonly currentSensorDatas: CurrentSensorData[] = [
    {
      topic: `${this.sensorParentTopic}/dht`,
      title: 'DHT Sensor',
      messageType: 'dht',
      icons: ['thermostat', 'humidity_percentage'],
    },
    {
      topic: `${this.sensorParentTopic}/wind_speed`,
      title: 'Wind Speed Sensor',
      messageType: 'windSpeed',
      icons: ['wind_power'],
    },
    {
      topic: `${this.sensorParentTopic}/solar_radiation`,
      title: 'Solar Radiation Sensor',
      messageType: 'solarRadiation',
      icons: ['solar_power'],
    },
    {
      topic: `${this.projectParentTopic}/data/et0`,
      title: 'ET0 (water evapotranspiration)',
      messageType: 'et0',
      icons: ['water'],
    },
  ];

  constructor() {}
}
