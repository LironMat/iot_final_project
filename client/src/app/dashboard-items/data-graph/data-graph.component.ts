import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { firstValueFrom } from 'rxjs';
import 'chartjs-adapter-moment';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-data-graph',
  templateUrl: './data-graph.component.html',
  styleUrls: ['./data-graph.component.scss'],
})
export class DataGraphComponent {
  @ViewChild(MatCard, { read: ElementRef }) card!: ElementRef;

  private _title: string = '';

  public get title(): string {
    return this._title;
  }

  @Input() set title(v: string) {
    this._title = v;
  }

  private _dataName: string = '';

  public get dataName(): string {
    return this._dataName;
  }

  @Input() set dataName(v: string) {
    this._dataName = v;

    this.changeDays(1);
  }

  public datasets: ChartDataset[] = [];

  public lineChartOptions: ChartOptions = {
    responsive: true,
    animation: false,
    scales: {
      x: {
        type: 'time',
      },
    },
  };

  fullscreen = false;

  constructor(private http: HttpClient) {}

  async changeDays(days: number) {
    const data = await firstValueFrom(
      this.http.get<any[]>(
        `http://localhost:3000/sensor_data/${this.dataName}/${days}`
      )
    );

    this.datasets = Object.keys(data[0])
      .filter((k) => k !== 'time')
      //@ts-ignore
      .map<ChartDataset>((key) => {
        return {
          label: key,
          animation: false,
          pointBorderWidth: 0,
          pointRadius: 0,
          //@ts-ignore
          data: data.map((d) => {
            return { x: new Date(d.time), y: d[key] };
          }),
        };
      });
  }

  toggleFullscreen() {
    if (this.fullscreen) {
      document.exitFullscreen();
    } else {
      this.card.nativeElement.requestFullscreen();
    }

    this.fullscreen = !this.fullscreen;
  }
}
