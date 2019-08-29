import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  message: String;
  username : String;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    if(sessionStorage.getItem('answer') == null){
      this.router.navigate(['/login']);
    } else {
      this.message = null;
      this.username = sessionStorage.getItem('username');
      var hide1:Boolean = true;
      var hide2:Boolean = true;
    }
  }

  newPassword(form:NgForm):void{
    if(form.invalid) return;
    if(form.value.password != form.value.password2){
      this.message = "Passwords dont match!"
    } else{
      this.service.changePassword(this.username, form.value.password).subscribe();
      this.router.navigate(['/login']);
    }
  }

  cancel():void{
    this.router.navigate(['/login']);
  }
}
