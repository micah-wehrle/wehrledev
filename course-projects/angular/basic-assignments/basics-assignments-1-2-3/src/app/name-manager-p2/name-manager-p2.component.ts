import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-name-manager-p2',
  templateUrl: './name-manager-p2.component.html',
  styleUrls: ['./name-manager-p2.component.css']
})
export class NameManagerP2Component implements OnInit {

  
  constructor() { }
  
  ngOnInit(): void {
  }
  
  userName:string = '';
  buttonEnabled:boolean = false;
  
  checkLength() {
    this.buttonEnabled = this.userName.length > 0;
  }

  clearName() {
    this.userName = '';
  }
}
