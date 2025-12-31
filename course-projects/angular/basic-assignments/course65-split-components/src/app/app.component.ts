import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  servers = [{name:"test", content:"Testing", type:"blueprint"}, {name:"test", content:"Testing", type:"server"}];

  onServerCreated(serverData:  {name: string, content: string, type: string} ) {
    this.servers.push({
      name: serverData.name,
      content: serverData.content,
      type: serverData.type
    });
  }
}
