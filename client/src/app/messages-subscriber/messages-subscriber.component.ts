import { Component, Input, OnDestroy } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { Subscription, delay } from 'rxjs';
import { MessageRecord } from '../models/message-record';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-messages-subscriber',
  templateUrl: './messages-subscriber.component.html',
  styleUrls: ['./messages-subscriber.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ left: '-100%' }),
        animate('800ms ease-in-out', style({ left: '0px' })),
      ]),
    ]),
  ],
})
export class MessagesSubscriberComponent implements OnDestroy {
  private subscription!: Subscription;
  private _topic!: string;
  private _title!: string;

  @Input() set title(value: string) {
    this._title = value;
  }

  public get title(): string {
    return this._title;
  }

  @Input() set topic(value: string) {
    this.subscription?.unsubscribe();
    this._topic = value;

    this.subscription = this._mqttService
      .observe(this._topic)
      .subscribe((message) => {
        this.messageRecords.push(new MessageRecord(message));
      });
  }

  messageRecords: MessageRecord[] = [];

  constructor(private _mqttService: MqttService) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
