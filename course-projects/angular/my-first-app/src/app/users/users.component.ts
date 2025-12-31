import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @Input() isUserActive: boolean = false;
  @Input() userName: string = '';

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
  }

  toggleActivation() {
    if(this.isUserActive) {
      this.usersService.deactivateUser(this.userName);
    }
    else {
      this.usersService.activateUser(this.userName);
    }
  }

}
