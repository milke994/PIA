import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { Result } from '../result.model';
import { Temp } from '../temp.model';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})

export class GuestComponent implements OnInit {
  usernames : [String] = [null];
  usernames2 : [String] = [null];
  resultsForMonth : [Temp] = [null];
  resultsForDays : [Temp] = [null];


  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    function checkScores(a, b){ return b.total - a.total; }
    this.resultsForMonth.pop();
    this.usernames.pop();
    this.usernames2.pop();
    this.resultsForDays.pop();
    var today = new Date();
    var twentyDaysAgo = new Date(today.getTime() - (20 * 24 * 60 * 60 * 1000));
    this.service.getResultsForMonth(today.getMonth() + 1).subscribe((results)=>{
      let temp = <[Result]>results;
      temp.forEach(element => {
        if(!this.usernames.includes(element.username)){
          let name = element.username;
          this.usernames.push(element.username);
          let t : Temp = new Temp(name);
          t.username = element.username;
          t.total = 0;
          this.resultsForMonth.push(t);
          let i = this.resultsForMonth.length - 1;
          temp.forEach(element => {
            if(element.username == name){
              this.resultsForMonth[i].total += <number>element.total;
            }
          });
        }
      });
      this.resultsForMonth.sort(checkScores);
    });
    this.service.getResultsBettwenTwoDates(today.getDate(),twentyDaysAgo.getDate(),
    today.getMonth() + 1, twentyDaysAgo.getMonth() + 1, today.getFullYear(), twentyDaysAgo.getFullYear())
    .subscribe((results)=>{
      if(results){
        let temp = <[Result]> results;
        temp.forEach(element => {
          if(!this.usernames2.includes(element.username)){
            let name = element.username;
            this.usernames2.push(element.username);
            let t : Temp = new Temp(name);
            t.username = element.username;
            t.total = 0;
            this.resultsForDays.push(t);
            let i = this.resultsForDays.length - 1;
            temp.forEach(element => {
              if(element.username == name){
                this.resultsForDays[i].total += <number>element.total;
              }
            });
          }
        });
      }
      this.resultsForDays.sort(checkScores);
    });
   }

}
