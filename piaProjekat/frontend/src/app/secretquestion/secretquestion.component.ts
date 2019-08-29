import { Component, OnInit } from '@angular/core';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { NgForm } from '@angular/forms';
import { User } from '../user.model';

@Component({
  selector: 'app-secretquestion',
  templateUrl: './secretquestion.component.html',
  styleUrls: ['./secretquestion.component.css']
})
export class SecretquestionComponent implements OnInit {

  username : String;
  message : String;
  question : String;

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    if(sessionStorage.getItem("username") == null){
      this.router.navigate(['/login']);
    } else{
      this.username = sessionStorage.getItem('username');
      this.question = sessionStorage.getItem('question');
      this.message = null;
    }
  }


  continueClicked(form : NgForm): void{
    if(form.invalid) return;
    else{
      this.service.checkAnswer(this.username, this.question, form.value.answer).subscribe((user : User)=>{
        if(!user){
          this.message = "Wrong answer!";
        } else {
          sessionStorage.setItem('answer', <string>user.secretAnswer);
          this.router.navigate(['/reset-password']);
        }
      })
    }
  }

  cancel():void{
    this.router.navigate(['/login']);
  }

}
