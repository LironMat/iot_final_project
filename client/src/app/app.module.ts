import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagesSubscriberComponent } from './messages-subscriber/messages-subscriber.component';
import { MqttModule } from 'ngx-mqtt';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [AppComponent, MessagesSubscriberComponent],
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
export class AppModule {}
