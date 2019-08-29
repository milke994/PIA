import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { NgForm } from '@angular/forms';
import { Game } from '../game.model';
import { Answer } from '../answer.model';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css']
})
export class SupervisorComponent implements OnInit {
  user : User;
  acceptWords: boolean;
  databaseWork: boolean;
  fromFile: boolean;
  gameType: String;
  message : String;
  selectedFile : File = null;
  answers : [Answer];
  json : JSON = null;
  letters = ['A','B','V','G','D','Đ','E','Ž','Z','I','J','K','L','Lj','M','N','Nj','O','P','R','S','T','Ć','U'
  ,'F','H','C','Č','Dž','Š'];
  categories = ['drzava', 'grad', 'jezero', 'planina', 'reka', 'zivotinja', 'biljka', 'muzika'];

  constructor(private router: Router, private service: UsersService) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    if(!this.user){
      this.router.navigate(['/login']);
    }
    if(this.user.type != "supervisor"){
      this.router.navigate(['/login']);
    }
    console.log(this.service);
    this.acceptWords = false;
    this.databaseWork = false;
    this.fromFile = null;
    this.gameType = null;
    this.message = null;
    this.answers = null;
  }

  databaseWorkButtonClicked():void{
    this.acceptWords = false;
    this.databaseWork = true;
  }

  acceptWordsButtonClicked():void{
    this.gameType = null;
    this.fromFile = null;
    this.databaseWork = false;
    this.message = null;
    this.acceptWords = true;
    this.service.getAnswers().subscribe((answer)=>{
      if(answer){
        this.answers = <[Answer]>answer;
      } else{
        this.answers = null;
      }
    });
  }

  acceptButtonClicked(date, cat: String, username: String, term: String){
    let allApproved = true;
    var index = 0;
    var i = 0;
    this.answers.forEach(element => {
      if(element.date == date && element.username == username){
        index = i;
        element.approveds[element.categories.indexOf(cat)] = true;
        element.approveds.forEach(element => {
          if(element == null){
            allApproved = false;
          }
        });
      }
      i += 1;
    });
    if(allApproved){
      this.service.updateAnswer(this.answers[index].date,this.answers[index].username,
        this.answers[index].approveds).subscribe();
        
      this.answers.splice(index,1);
      console.log(this.answers);
    }
  }

  dissmisButtonClicked(date, cat: String, username: String, term: String){
    let allApproved = true;
    var index = 0;
    var i = 0;
    this.answers.forEach(element => {
      if(element.date == date && element.username == username){
        index = i;
        element.approveds[element.categories.indexOf(cat)] = false;
        element.approveds.forEach(element => {
          if(element == null){
            allApproved = false;
          }
        });
      }
      i += 1;
    });
    if(allApproved){
      this.service.updateAnswer(this.answers[index].date,this.answers[index].username,
        this.answers[index].approveds).subscribe();
        
        this.answers.splice(index,1);
        console.log(this.answers);
    }
  }

  manuallyClicked(){
    this.fromFile = false;
  }

  fromFileClicked(){
    this.gameType = null;
    this.message = null;
    this.fromFile = true;
  }

  saveToDatabase(form: NgForm){
    if(form.invalid) return;
      else{
        if(!this.fromFile){
          if(this.gameType == 'Anagram'){
            this.service.getGames().subscribe((game : Game)=>{
              game.Anagrami.forEach(element => {
                if(element.zagonetka == form.value.riddle && element.resenje == form.value.answer){
                  this.message = "Vec postoji u bazi!";
                }
              });
              if(this.message != "Vec postoji u bazi!"){
                 this.service.updateAnagrams(form.value.riddle, form.value.answer).subscribe();
                 this.fromFile = null;
                 this.gameType = null;
                 form.reset();
                 this.databaseWork = false;
              }
            })
          }
          if(this.gameType == 'Geography'){
            var found : boolean = false;
            this.service.getGames().subscribe((game : Game)=>{
              if(game){
                game.Geografija.forEach(element => {
                  if(element.slovo == form.value.letter){
                    found = true;
                    let terms = element.odgovori[this.categories.indexOf(form.value.category)].termin.split(',');
                    terms.forEach(element => {
                      if(element == form.value.term){
                        this.message = "Vec Postoji u bazi!";
                      }
                    });
                    if(this.message != "Vec Postoji u bazi!"){
                      let newTerms;
                      if(element.odgovori[this.categories.indexOf(form.value.category)].termin.length != 0){
                        newTerms = element.odgovori[this.categories.indexOf(form.value.category)].termin + ',' 
                        + form.value.term;
                      } else{
                        newTerms = form.value.term;
                      }
                      this.service.updateGeography(element.slovo, 
                        element.odgovori[this.categories.indexOf(form.value.category)].kategorija,
                        element.odgovori[this.categories.indexOf(form.value.category)].termin,
                        newTerms).subscribe();
                        this.fromFile = null;
                        this.gameType = null;
                        form.reset();
                        this.databaseWork = false;
                    }
                  }
                });
                if(!found){
                  var newRow = {
                    slovo: form.value.letter,
                    odgovori:[]
                  }
                  this.categories.forEach(element => {
                    newRow.odgovori.push({
                      kategorija : element,
                      termin : ""
                    })
                  });
                  newRow.odgovori[this.categories.indexOf(form.value.category)].termin = form.value.term;
                  console.log(newRow);
                  this.service.insertGeography(newRow).subscribe();
                  this.fromFile = null;
                  this.gameType = null;
                  form.reset();
                  this.databaseWork = false;
                }
              }
            })
          }
        }
      }
  }

  saveToDatabaseFromFile(form:NgForm):void{
    this.service.insertGames(this.json['Anagrami'], this.json['Geografija']).subscribe();
    this.json = null;
    this.fromFile = null;
    this.databaseWork = false;
    form.reset();
  }

  onFileSelected(event){
    this.selectedFile = event.target.files[0];
    let reader = new FileReader();
    reader.readAsText(this.selectedFile);
    reader.onload = ()=>{
      this.json = JSON.parse(reader.result.toString());
      console.log(this.json['Anagrami']);
      console.log(this.json['Geografija']);
      // this.service.insertGames(json.Anagrami, json.Geografija).subscribe();
    }
    console.log(event);
    console.log(this.selectedFile);
  }

}
