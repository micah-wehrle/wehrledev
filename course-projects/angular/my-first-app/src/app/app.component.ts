import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  activeUsersPointer: string[];
  inactiveUsersPointer: string[];

  constructor(private usersService: UsersService) {};

  ngOnInit(): void {
      this.activeUsersPointer = this.usersService.activeUsers;
      this.inactiveUsersPointer = this. usersService.inactiveUsers;
  }
}
