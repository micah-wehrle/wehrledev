import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {

  allowNewServer:boolean = false;
  serverCreationStatus:string = 'No server was created.';
  serverName:string = 'Test';
  serverCreated:boolean = false;
  servers:Array<string> = ['Testserver', 'Testserver 2'];

  constructor() { 
    setTimeout(() => {
      this.allowNewServer = true;
    }, 2000)

  }

  ngOnInit(): void {  
  }

  onCreateServer() {
    this.serverCreated = true;
    this.servers.push(this.serverName);
    this.serverCreationStatus = 'Server was created. Server name is ' + this.serverName;
  }

  onUpdateServerName(event:Event) {
    this.serverName = (<HTMLInputElement>event.target).value;
  }

}
