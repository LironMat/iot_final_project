import { IMqttMessage } from 'ngx-mqtt';

export class MessageRecord {
  time: Date;
  message: IMqttMessage;

  constructor(message: IMqttMessage) {
    this.time = new Date();
    this.message = message;
  }

  get content() {
    return JSON.parse(this.message.payload.toString());
  }

  get topic() {
    return this.message.topic;
  }
}
