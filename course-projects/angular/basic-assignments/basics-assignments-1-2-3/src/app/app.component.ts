import { Component } from '@angular/core';
import { SuccessAlertComponent } from './success-alert/success-alert.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showParagraphToggle:boolean = true;
  dataLog:Array<object> = [];

  constructor() {
    setTimeout(() => {this.dataLog.shift()}, 5000)
  }

  addDataToLog() {
    this.showParagraphToggle = !this.showParagraphToggle;
    this.dataLog.push({"time": Date.now(), "newStyle": this.dataLog.length >= 4});
  }
  
}
