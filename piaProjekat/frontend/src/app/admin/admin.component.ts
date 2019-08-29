import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { User } from '../user.model';
import { Game } from '../game.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user : User;
  listUsers: boolean;
  defineGameOfTheDay:boolean;
  users : User[] = [];
  today : Date = new Date();
  game : Game;
  anagrams;
  chosenDate : Date;
  message : String;

  constructor(private router: Router, private service: UsersService) { }
  

  ngOnInit() {
    
    this.user = JSON.parse(sessionStorage.getItem("user"));
    if(!this.user){
      this.router.navigate(['/login']);
    }
    if(this.user.type != "admin"){
      this.router.navigate(['/login']);
    }
    this.defineGameOfTheDay = false;
    this.listUsers = false;
    this.message = null;
    this.service.getGames().subscribe((game : Game)=>{
      if(!game) {console.log('nema definisanih igara!');}
      else{
        this.game = game;
        this.anagrams = this.game.Anagrami;
      }
    });
  }

  listUsersPressed():void{
    this.defineGameOfTheDay = false;
    this.listUsers = true;
    this.message = null;
    this.service.unapprovedUsers().subscribe((user : User[])=>{
      this.users = user;
    })
  }

  defineGameOfTheDayPressed():void{
    this.listUsers = false;
    this.defineGameOfTheDay = true;
  }

  userApproved(user : User):void{
    this.service.approveUser(user.username).subscribe();
    this.service.unapprovedUsers().subscribe((user:User[])=>{
      this.users = user;
    })
  }

  userUnapproved(user : User):void{
    this.service.unapproveUser(user.username).subscribe();
    this.service.unapprovedUsers().subscribe((user:User[])=>{
      this.users = user;
    })
  }

  onDateSelected(event):void{
    this.chosenDate = new Date(event.target.value);
  }

  saveGameOfTheDay(form:NgForm):void{
    if(form.invalid) return;
    let zagonetka : String = form.value.anagram1;
    var anagram = zagonetka.split('/', 2);
    this.service.checkGameOfTheDay(this.chosenDate.getDate(), this.chosenDate.getMonth() + 1,
    this.chosenDate.getFullYear()).subscribe((gameoftheday)=>{
      if(gameoftheday){
        this.message = "Already defined game of the day for the selected date"!
      } else{
        this.service.saveGameOfTheDay(this.chosenDate.getDate(),this.chosenDate.getMonth() + 1, 
        this.chosenDate.getFullYear(), anagram[0], anagram[1]).subscribe((gameoftheday)=>{
        if(gameoftheday){
          this.message = "Saved sucesfully!";
          form.reset();
        }
      });
      }
    })
  }

}
