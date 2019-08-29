import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { User } from '../user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  login: boolean;
  logedin : boolean;
  user : User;
  imgUrl;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    this.user = null;
    this.login = false;
    this.logedin = false;
    this.imgUrl = null;
    if(!sessionStorage.getItem('user') && !sessionStorage.getItem('username')){
      this.login = true;
    } else {
      let a = sessionStorage.getItem('user');
      if(a != 'guest'){
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.imgUrl = this.user.picture;
      }
      if(sessionStorage.getItem('user')){
        this.logedin = true;
      }
    }
  }

  enterGuest():void{
    sessionStorage.setItem('user', 'guest');
    this.router.navigate(['/guest']);
  }

  logout():void{
    this.router.navigate(['/login']);
  }

}
