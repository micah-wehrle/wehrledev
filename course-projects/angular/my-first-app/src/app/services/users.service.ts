import { Injectable, OnInit } from "@angular/core";

@Injectable({providedIn: 'root'})
export class UsersService {
  activeUsers: string[] = ['Micah', 'Aaron'];
  inactiveUsers: string[] = ['Kerry', 'Tyler'];
  timesUserSwitchedActivity: number = 0;

  constructor() {}

  activateUser(user: string): boolean {
    const userLocation = this.inactiveUsers.indexOf(user);
    if(userLocation > -1) {
      this.activeUsers.push(this.inactiveUsers[userLocation]);
      this.inactiveUsers.splice(userLocation, 1);
      console.log(++this.timesUserSwitchedActivity);
      return true;
    }

    return false;
  }

  deactivateUser(user: string): boolean {
    const userLocation = this.activeUsers.indexOf(user);
    if(userLocation > -1) {
      this.inactiveUsers.push(this.activeUsers[userLocation]);
      this.activeUsers.splice(userLocation, 1);
      console.log(++this.timesUserSwitchedActivity);
      return true;
    }

    return false;
  }
}