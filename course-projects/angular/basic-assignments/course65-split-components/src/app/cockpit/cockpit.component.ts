import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css']
})


export class CockpitComponent implements OnInit {

  serverName: string = '';
  serverContent: string = '';
  
  @Output() serverCreated = new EventEmitter< {name: string, content: string, type: string} >();

  constructor() { }

  ngOnInit(): void {
  }

  addServer(serverType: string) {
    this.serverCreated.emit( {name: this.serverName, content: this.serverContent, type: serverType} );
  }

}
