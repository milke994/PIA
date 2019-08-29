import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { Gameoftheday } from '../gameoftheday.model';
import { NgForm } from '@angular/forms';
import { Game } from '../game.model';
import { User } from '../user.model';
import { Answer } from '../answer.model';

@Component({
  selector: 'app-game-of-the-day',
  templateUrl: './game-of-the-day.component.html',
  styleUrls: ['./game-of-the-day.component.css']
})
export class GameOfTheDayComponent implements OnInit {
  user : User;
  letters = ['A','B','V','G','D','Đ','E','Ž','Z','I','J','K','L','Lj','M','N','Nj','O','P','R','S','T','Ć','U'
  ,'F','H','C','Č','Dž','Š'];
  categories = ['drzava', 'grad', 'jezero', 'planina', 'reka', 'zivotinja', 'biljka', 'muzika'];
  time : number;
  interval;
  have : boolean = null;
  game :Gameoftheday = null;
  message : String = null;
  points = {
    anagram : 0,
    mojBroj : 0,
    geografija : 0
  }
  total : number;
  points3 : [number];
  games : Game;
  index : number;
  numberToGet : number;
  numbers : [number];
  temp : [number];
  gameTurn : number;
  answer2 : String;
  result2 : number;
  letter : String;
  lastChar;
  @ViewChild('answer') public answer : ElementRef;
  @ViewChild('stopButton') public stopButton: ElementRef;

  operations = ['+', '-', '/', '*', '(', ')'];

  constructor(private router: Router, private service: UsersService) {  }

  stopTimer():void{
    if(this.interval){
      clearInterval(this.interval);
    }
  }

  startTimer():void{
    this.interval = setInterval(()=>{
      if(this.time > 0){
        this.time -=1;
      } else{
        //TODO Disable input
        if(this.gameTurn == 1){
          this.answer.nativeElement.disabled = true;
        }
        this.message = "Time is up, think faster next time!";
        this.stopTimer();
        this.changeGame();
      }
    }, 1000);
  }

  waitApprove(day, month, year, username):void{
    this.interval = setInterval(()=>{
      this.service.getAnswer(day, month, year, username).subscribe((approv)=>{
        let ans = <Answer> approv;
        let done = true;
        ans.approveds.forEach(element => {
          if(element == null){
            done = false;
          }
        });
        if(done){
          this.message = null;
          ans.categories.forEach(element =>{
            if(ans.approveds[ans.categories.indexOf(element)]){
              this.points3[this.categories.indexOf(<string>element)] = 4;
            } else {
              this.points3[this.categories.indexOf(<string>element)] = 0;
            }
          });
          this.service.deleteAnswer(ans.date, ans.username).subscribe();
          this.points.geografija = 0;
          this.points3.forEach(element => {
            this.points.geografija += element;
          });
          this.total = this.points.anagram + this.points.mojBroj + this.points.geografija;
          this.changeGame();
          clearInterval(this.interval);
        }
      })
    }, 2000);
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    let today = new Date();
    this.service.checkGameOfTheDay(today.getDate(), today.getMonth() + 1, today.getFullYear()).subscribe((gameOfTheDay)=>{
      if(!gameOfTheDay){
        this.have = false;
        this.message = "Sorry, we didnt define game of the day for today!"
      } else{
        this.service.getResult(today.getDate(), today.getMonth() + 1, today.getFullYear(), this.user.username)
        .subscribe((result)=>{
          console.log(result);
          if(result){
            this.have = false;
            this.message="You already played game od the day today!";
          } else {
            this.game = <Gameoftheday>gameOfTheDay;
            this.have = true;
            this.gameTurn = 1;
            this.service;
            this.time = 60;
            this.startTimer();
          }
        })
      }
    });
    
  }

  prepareGame2(){
    this.time = 60;
    this.index = 0;
    this.numberToGet = null;
    this.answer2 = null;
    this.result2 = 0;
    this.numbers = [0];
    this.temp = [0];
    this.temp.pop();
    this.numbers.pop();
  }
  prepareGame3(){
    this.time = 120;
    this.letter = null;
    this.points3 = [0];
    this.points3.pop();
  }

  changeGame(){
    setTimeout(()=>{
      this.message = null;
      this.gameTurn += 1;
      if(this.gameTurn == 2){
        this.prepareGame2();
      }
      if(this.gameTurn == 3){
        this.prepareGame3();
      }
    }, 5000);
  }

  checkAnagram():void{
    if(this.game.anagram.resenje == this.answer.nativeElement.value){
      this.message = "Correct! You won 10 points!";
      this.points.anagram = 10;
    } else{
      this.message = "Incorrect, sorry, but no points for you!";
    }
    this.answer.nativeElement.disabled = true;
    this.stopTimer();
    this.changeGame();
  }

  stop():void{
    if(this.numberToGet == null){
      this.numberToGet = Math.floor(Math.random() * 999) + 1;
    } else{
      if(this.index < 4){
        this.numbers.push(Math.floor(Math.random() * 9) + 1);
      }
      if(this.index == 4){
        let random = Math.floor(Math.random() * 3) + 1;
        switch(random){
          case 1:{
            this.numbers.push(10);
            break;
          }
          case 2:{
            this.numbers.push(15);
            break;
          }
          case 3:{
            this.numbers.push(20);
            break;
          }
        }  
      }
      if(this.index == 5){
        let random = Math.floor(Math.random() * 4) + 1;
        switch(random){
          case 1:{
            this.numbers.push(25);
            break;
          }
          case 2:{
            this.numbers.push(50);
            break;
          }
          case 3:{
            this.numbers.push(75);
            break;
          }
          case 4:{
            this.numbers.push(100);
            break;
          }
        }
        this.numbers.forEach(element => {
          this.temp.push(element);
        });
        this.startTimer();
      }
      this.index += 1;
    }
  }

  add(num : number):void{
    if(this.numbers.includes(num)){
      if(!this.answer2 || (this.operations.includes(this.lastChar) && this.lastChar != ')')){
        this.lastChar = this.numbers[this.numbers.indexOf(num)];
        if(!this.answer2){
          this.answer2 = this.lastChar.toString();  
        } else{
          this.answer2 += this.lastChar.toString();
        }
        this.result2 += num;
        this.numbers.splice(this.numbers.indexOf(num), 1);
      }
    }
  }

  operation(op : String):void{
    if(op == '(' && !this.numbers.includes(Number.parseInt(this.lastChar))){
      this.lastChar = op;
      if(!this.answer2){
        this.answer2 = this.lastChar.toString();
      } else{
        this.answer2 += this.lastChar.toString();
      }
    }
    else{
      if(this.lastChar && !this.operations.includes(this.lastChar) || this.lastChar == ')'){
        this.lastChar = op;
        this.answer2 += this.lastChar.toString();
      }
    }
  }

  reset():void{
    this.lastChar = null;
    this.answer2 = null;
    console.log(this.temp);
    var i = 0;
    let n = this.numbers.length;
    while(i < n){
      this.numbers.pop();
      i++;
    }
    this.temp.forEach(element => {
      this.numbers.push(element);
    });
  }

  done():void{
    if(eval(<string>this.answer2) == this.numberToGet){
      this.points.mojBroj = 10;
      this.message = "Correct! You won 10 points!";
    } else{
      this.message = "Incorrect, you won 0 points!";
    }
    this.stopTimer();
    this.changeGame();
  }

  stop3(){
    if(!this.letter){
      let random = Math.floor(Math.random() * 30) + 1;
      this.letter = this.letters[random];
      this.service.getGeographyForLetter(this.letter).subscribe((game : Game)=>{
        this.games = game;
      });
      this.startTimer();
    }
  }

  done3(form : NgForm):void{
    this.stopTimer();
    var i = 0;
    let answers = [form.value.drzava, form.value.grad, form.value.jezero, form.value.planina, form.value.reka,
    form.value.zivotinja, form.value.biljka, form.value.muzika];
    let category : [String] = [""];
    let term : [String] = [""];
    term.pop();
    category.pop();
    while(i < 8){
      let a = this.games.Geografija[this.letters.indexOf(<string>this.letter)].odgovori[i].termin.split(',');
      if(a.includes(answers[i])){
        this.points3.push(2);
      } else{
        category.push(this.categories[i]);
        term.push(answers[i]);
        this.points3.push(0);      
      }
      i+=1;
    }
    if(category.length > 0){
      var done = false;
      i = 0;
      let approveds = [true];
      approveds.pop();
      while (i < category.length){
        approveds.push(null);
        i += 1;
      }
      let today = new Date();
      this.service.pushAnswers(today.getDate(),today.getMonth() + 1,today.getFullYear(),
      this.user.username, category, term, approveds).subscribe();
      this.message = "Waiting for supervisor to approve some words";
      this.waitApprove(today.getDate(),today.getMonth() + 1,today.getFullYear(),
      this.user.username);
    } else{
      this.points.geografija = 0;
      this.points3.forEach(element => {
        this.points.geografija += element;
      });
      this.total = this.points.anagram + this.points.mojBroj + this.points.geografija;
      this.changeGame();
    }
  }
  done4():void{
    let today = new Date();
    this.service.insertResult(today.getDate(),today.getMonth() + 1, today.getFullYear(),
    this.user.username, this.total).subscribe((result)=>{
      if(result) {
        console.log('ubaceno');
      } else {
        console.log('ne moze');
      }
    });
    this.router.navigate(['/user']);
  }

  goBack():void{
    this.router.navigate(['/user']);
  }
}
