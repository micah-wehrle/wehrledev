import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 

import { AppComponent } from './app.component';
import { ServerComponent } from './server/server.component';
import { ServersComponent } from './servers/servers.component';

@NgModule({
  declarations: [ // Add components
    AppComponent,
    ServerComponent,
    ServersComponent
  ],
  imports: [ // Add other modules into this module
    BrowserModule 
  ],
  providers: [],
  bootstrap: [AppComponent] // Stuff that angular needs to know when it analyzes index.html (ie have this component ready when you go through the index.html, so you can replace <app-root> with instructions from here)
})
export class AppModule { }
