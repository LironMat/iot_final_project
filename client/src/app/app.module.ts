import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesSubscriberComponent } from './messages-subscriber/messages-subscriber.component';
import { MqttModule } from 'ngx-mqtt';
import { MaterialModule } from './material/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CurrentSensorDataComponent } from './dashboard-items/current-sensor-data/current-sensor-data.component';
import { MessageContentPipe } from './pipes/message-content.pipe';
import { MatIconRegistry } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    MessagesSubscriberComponent,
    DashboardComponent,
    CurrentSensorDataComponent,
    MessageContentPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MqttModule.forRoot({
      hostname: 'localhost', //'broker.hivemq.com',
      port: 9001, //8884,
      protocol: 'ws',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(iconRegistry: MatIconRegistry) {
    iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
