import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css']
})
export class GameControlComponent implements OnInit {

  private count: number = 1;
  private intervalRef: NodeJS.Timer;
  private isGameRunning: boolean = false;
  
  @Output() currentNumber = new EventEmitter<number>();

  constructor() { 
    // I don't like this but it's the only way I could 'instantiate' intervalRef
    this.intervalRef = setInterval(() => {}, 1000);
    clearInterval(this.intervalRef);
  }

  ngOnInit(): void {
  }

  startTimer() {
    if(!this.isGameRunning) {
      this.isGameRunning = true;
      this.intervalRef = setInterval(() => {

        this.currentNumber.emit(this.count);
        this.count++;

      }, 1000);
    }
  }

  stopTimer() {
    this.isGameRunning = false;
    clearInterval(this.intervalRef);
  }




}
