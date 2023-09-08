import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageContent',
})
export class MessageContentPipe implements PipeTransform {
  transform(value: any, messageType: string): string {
    if (!value) {
      return '';
    }

    switch (messageType) {
      case 'dht':
        return `Temperature: ${value.temperature}°, Humidity: ${value.humidity}%`;
      case 'windSpeed':
        return `Wind Speed: ${value.windSpeed} k/mh`;
      case 'solarRadiation':
        return `Solar Radiation: ${value.solarRadiation} W/m^2`;
      case 'et0':
        return `ET0: ${value.et0} mm`;
      default:
        return value;
    }
  }
}
