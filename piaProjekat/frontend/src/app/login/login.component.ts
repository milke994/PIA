import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

import {UsersService} from '../users.service';
import {User} from '../user.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 
  message : String;
  message2 : String;
  message3 : String;
  forgotpassword : boolean;
  resetpassword : boolean;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
     var hide = false;
     var hide1 = false;
     var hide2 = false;
     var hide3 = false;
     this.message = null;
     this.message2 = null;
     this.message3 = null;
     this.forgotpassword = false;
     this.resetpassword = false;
     sessionStorage.clear();
  }

  register():void{
    sessionStorage.setItem('username', 'reg');
    this.router.navigate(['/register']);
  }

  forgotPassword():void{
    this.resetpassword = false;
    this.forgotpassword = true;
    this.message3 = null;
  }

  login(form : NgForm):void{
    if(form.invalid){ 
      return;
    }
    else {
    this.service.login(form.value.username, form.value.password).subscribe((user: User)=>{
      if(!user){
        this.message = "Wrong username and/or password";
      }
      else{
        sessionStorage.setItem("user", JSON.stringify(user[0]));
        if(user[0].type=='user') {
          this.router.navigate(['/user']);
        }
        else {
            if(user[0].type=='admin'){
              this.router.navigate(['/admin']);
            } else{
              this.router.navigate(['/supervisor']);
            }
          } 
        }     
    })
  }

}

forgotenPassword(form : NgForm):void{
  if(form.invalid) return;
  else{
    this.service.checkUser(form.value.username, form.value.jmbg).subscribe((user : User)=>{
      if(!user){
        this.message2 = "Wrong username and/or jmbg";
      } else{
        if(user.type != 'user'){
          this.message2 = "You have no permission to change data of that type od user";
        } else {
          sessionStorage.setItem('username', <string>user.username);
          sessionStorage.setItem('question', <string> user.secretQuestion);
          this.router.navigate(['/secret-question']);
        }
      }
    })
  }
}

cancelforgot():void{
  this.forgotpassword = false;
  this.message2 = null;
}

resetPass():void{
  this.forgotpassword = false;
  this.resetpassword = true;
  this.message2 = null;
}

cancelreset():void{
  this.resetpassword = false;
  this.message3 = null;
}

resetPassword(form:NgForm):void{
  if(form.invalid) return;
  this.service.login(form.value.username, form.value.password).subscribe((user : User)=>{
    if(!user){
      this.message3 = "Wrong username and/or password";
    } else {
      if(user[0].type != 'user'){
        this.message3 = "You have no permission to change data for that type of user!";
        } else{
        if(form.value.password == form.value.newpassword){
          this.message3 = "Please enter new password!";
        }else{
          if(form.value.newpassword != form.value.newpassword2){
            this.message3 = "New Passwords dont match!"
          } else{
            this.service.changePassword(form.value.username, form.value.newpassword).subscribe();
            this.message = "Password changed succesfuly!";
            this.message3 = null;
            form.reset;
            this.resetpassword = false;
          }
        }
      }
    }
  })
}

}
