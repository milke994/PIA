import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { Result } from '../result.model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  user : User;
  results: [Result] = [null];
  myResult : Result;
  rank : number;

  constructor(private router: Router, private service: UsersService) {  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if(!this.user){
      this.router.navigate(['/login']);
    } else {
      this.myResult = null;
      this.results.pop();
      let today = new Date();
      this.service.getResultsForDate(today.getDate(),today.getMonth() + 1, today.getFullYear())
      .subscribe((results)=>{
        this.results = <[Result]>results;
        function compareNumbers(a, b){
          return b.total - a.total;
        }
        this.results.sort(compareNumbers);
        console.log(this.results);
        this.results.forEach(element => {
          if(element.username == this.user.username){
            if(this.results.indexOf(element) >= 10){
              this.rank = this.results.indexOf(element);
              this.myResult = element;
              console.log(this.myResult);
            }
          }
        });
      })
    }
  }

  goBack(){
    this.router.navigate(['/user']);
  }

}
