import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  approved : Boolean;
  user : User;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    if(!this.user){
      this.router.navigate(['/login']);
    }
    if(this.user.type != "user"){
      this.router.navigate(['/login']);
    } else{
      this.approved = this.user.approved;
    }
  }

  playTheGameOfTheDay():void{
    this.router.navigate(['/gameOfTheDay']);
  }

  resultsButtonClicked():void{
    this.router.navigate(['/results']);
  }

}
