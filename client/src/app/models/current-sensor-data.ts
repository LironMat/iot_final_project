export interface CurrentSensorData {
  title: string;
  topic: string;
  messageType: string;
  icons: string[];
}

export interface DataGraph {
  title: string;
  dataName: string;
}

export interface DataPoint {
  [x: string]: any;
  time: Date;
}
