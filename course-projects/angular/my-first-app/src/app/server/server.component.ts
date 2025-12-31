import { Component } from '@angular/core';
import { SeededBanDataGenerator } from '../models/seed.model';

@Component({
    selector: 'app-server',
    templateUrl: './server.component.html',
    styles: [`
        .online {
            color: yellow;
        }
    `]
})
export class ServerComponent { 
    serverId:number = 10;
    serverStatus:string = 'offline';

    seededBan: SeededBanDataGenerator;

    constructor() {
        this.serverStatus = Math.random() < 0.5 ? 'offline' : 'online';

        // for(let i = 0; i < 10; i++) {
        //     const randNum = Math.floor(Math.random()*900000000)+100000000;
        //     this.seededBan = new SeededBanDataGenerator(randNum);//Math.round(Math.random()*1000));
        //     console.log('BAN: ' + randNum + ' - Phone: ' + this.seededBan.getPhoneNumber() + ' - Address: ' + this.seededBan.getAddress() + ' - CID: ' + this.seededBan.getCircuitID());//this.seededBan.getAddress(), this.seededBan.getPhoneNumber());
        // }
    }

    getServerStatus() {
        return this.serverStatus;
    }
    
    getColor() {
        return this.serverStatus === 'online' ? 'green' : 'red';
    }
}
