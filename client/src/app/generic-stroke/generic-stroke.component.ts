import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-generic-stroke',
  templateUrl: './generic-stroke.component.html',
  styleUrls: ['./generic-stroke.component.scss'],
})
export class GenericStrokeComponent implements OnInit {
  @Input() points: string;
  viewBoxSetting: string;
  color = 'black'; // default value
  strokeWidth = 2; // default value
  constructor() {
    //
   }

  ngOnInit() {
    //
  }
  addPoints(posX: number, posY: number) {
    this.points += ' ' + (posX) + ',' + posY;
    //this.setColor(this.getRandomColor()); //uncomment for fun
  }
  iniPoints(posX: number, posY: number) {
    this.points = ' ' + posX + ',' + posY;
    this.points += ' ' + (posX + 1) + ',' + (posY + 1);
  }
  setViewBoxSetting() {
    this.viewBoxSetting = '0 0 ' + window.innerWidth + ' ' + window.innerHeight;
  }
  setColor(targetColor: string) {
    this.color = targetColor;
  }
  setStrokeWidth(targetWidth: number) {
    this.strokeWidth = targetWidth;
  }
  getRandomColor(): string {
    return '#' + Math.floor(Math.random() * Math.floor(999999));
  }
}