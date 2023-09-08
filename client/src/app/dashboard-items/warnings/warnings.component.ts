import { Component, OnDestroy } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.component.html',
  styleUrls: ['./warnings.component.scss'],
})
export class WarningsComponent implements OnDestroy {
  private subscription!: Subscription;
  
  time!: Date;
  warnings: string[] = [];

  constructor(private _mqttService: MqttService) {
    this.subscription = this._mqttService
      .observe('lm/iot/warn')
      .subscribe((message) => {
        this.time = new Date();
        this.warnings = JSON.parse(message.payload.toString());
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
