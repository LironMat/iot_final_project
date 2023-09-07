import { Component, Input } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { MessageRecord } from 'src/app/models/message-record';

@Component({
  selector: 'app-current-sensor-data',
  templateUrl: './current-sensor-data.component.html',
  styleUrls: ['./current-sensor-data.component.scss'],
})
export class CurrentSensorDataComponent {
  lastMessageRecord: MessageRecord | undefined;

  private subscription!: Subscription;

  private _icons: string[] = [];

  public get icons(): string[] {
    return this._icons;
  }

  @Input() set icons(v: string[]) {
    this._icons = [...v];
  }

  private _messageType: string = '';

  public get messageType(): string {
    return this._messageType;
  }

  @Input() set messageType(v: string) {
    this._messageType = v;
  }

  private _title: string = '';

  public get title(): string {
    return this._title;
  }

  @Input() set title(v: string) {
    this._title = v;
  }

  private _topic: string = '';

  public get topic(): string {
    return this._topic;
  }

  @Input() set topic(v: string) {
    this.subscription?.unsubscribe();

    this._topic = v;

    this.subscription = this._mqttService
      .observe(this._topic)
      .subscribe((message) => {
        this.lastMessageRecord = new MessageRecord(message);

        console.log(this.lastMessageRecord);
      });
  }

  constructor(private _mqttService: MqttService) {}
}
