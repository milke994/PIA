import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  uri='http://localhost:4000'

  constructor(private http: HttpClient) { }


  login(username, password){
    const data = {
      username: username,
      password: password
    };

    return this.http.post(`${this.uri}/login`, data);
  }

  register(name, lastname, mail, occupation, username, password, genre, jmbg, secretQuestion, secretAnswer, file ,type, approved){
    const data = {
      name : name,
      lastname : lastname,
      mail : mail,
      occupation : occupation,
      username : username,
      password : password,
      genre : genre,
      jmbg : jmbg,
      secretQuestion : secretQuestion,
      secretAnswer : secretAnswer,
      picture : file,
      type : type,
      approved : approved
    }

    return this.http.post(`${this.uri}/register`, data);
  }

  changePassword(username, password){
    const data = {
      username : username,
      password : password
    }

    return this.http.post(`${this.uri}/changePassword`, data);
  }

  pushAnswers(day,month,year,username,category,term,approved){
    const data = {
      date : {
        day : day,
        month: month,
        year: year
      },
      username : username,
      categories: category,
      terms: term,
      approveds: approved
    }

    return this.http.post(`${this.uri}/pushAnswers`, data);
  }

  getAnswers(){
    return this.http.get(`${this.uri}/getAnswers`);
  }

  getAnswer(day, month, year, username){
    const data = {
      date : {
        day : day,
        month : month,
        year : year
      },
      username : username
    }
    return this.http.post(`${this.uri}/getAnswer`, data);
  }

  deleteAnswer(date,username){
    const data = {
      date : date,
      username : username
    }
    return this.http.post(`${this.uri}/deleteAnswer`, data);
  }

  updateAnswer(date,username,approveds){
    const data = {
      date : date,
      username : username,
      approveds : approveds
    }
    return this.http.post(`${this.uri}/updateAnswer`, data);
  }

  unapprovedUsers(){
    return this.http.get(`${this.uri}/unapprovedUsers`);
  }

  approveUser(username){
    return this.http.get(`${this.uri}/approveUser/${username}`);
  }

  unapproveUser(username){
    return this.http.get(`${this.uri}/unapproveUser/${username}`);
  }

  checkUser(username, jmbg){
    const data = {
      username : username,
      jmbg : jmbg
    }

    return this.http.post(`${this.uri}/checkUser`, data);
  }

  checkAnswer(username, question, answer){
    const data = {
      username : username,
      question : question,
      answer : answer
    }

    return this.http.post(`${this.uri}/checkAnswer`, data);
  }

  getGeography(slovo, kategorija){
    const data = {
      slovo : slovo,
      kategorija : kategorija
    }
    return this.http.post(`${this.uri}/getGeography`, data);
  }

  updateAnagrams(zagonetka, resenje){
    const data = {
      zagonetka: zagonetka,
      resenje : resenje
    }
    return this.http.post(`${this.uri}/updateAnagrams`, data);
  }

  getGeographyForLetter(slovo){
    return this.http.get(`${this.uri}/getGeographyForLetter/${slovo}`);
  }

  updateGeography(slovo, kategorija, termin, novitermin){
    const data = {
      stari : {
        slovo : slovo,
        odgovori : {
          kategorija : kategorija,
          termin : termin
        }
      },
      novitermin : novitermin
    }
    return this.http.post(`${this.uri}/updateGeography`, data);
  }

  insertGames(anagrami, geografija){
    const data = {
      Anagrami : anagrami,
      Geografija : geografija
    }
    return this.http.post(`${this.uri}/insertGames`, data);
  }

  insertGeography(dat){
    const data = {
      dat : dat
    }
    return this.http.post(`${this.uri}/insertGeography`, data);
  }

  getGames(){
    return this.http.get(`${this.uri}/getGames`);
  }

  saveGameOfTheDay(day, month, year, zagonetka, resenje){
    const data = {
      date : {
        day : day,
        month: month,
        year: year
      },
      anagram : {
        zagonetka : zagonetka,
        resenje : resenje
      }
    }
    return this.http.post(`${this.uri}/saveGameOfTheDay`, data);
  }

  checkGameOfTheDay(day, month, year){
    const data = {
      date : {
        day : day,
        month : month,
        year : year
      }
    }
    return this.http.post(`${this.uri}/checkGameOfTheDay`, data);
  }

  insertResult(day,month,year,username,total){
    const data = {
      date : {
        day : day,
        month : month,
        year : year
      },
      username : username,
      total : total
    }
    return this.http.post(`${this.uri}/insertResult`, data);
  }

  getResult(day,month,year,username){
    const data = {
      date : {
        day : day,
        month : month,
        year : year
      },
      username : username
    }
    return this.http.post(`${this.uri}/getResult`, data);
  }
  
  getResultsForDate(day,month,year){
    const data = {
      date: {
        day : day,
        month : month,
        year : year
      }
    }
    return this.http.post(`${this.uri}/getResultsForDate`, data);
  }

  getResultsForMonth(month){
    return this.http.get(`${this.uri}/getResultsForMonth/${month}`);
  }

  getResultsBettwenTwoDates(day1, day2, month1, month2, year1, year2){
    const data = {
      date1 : {
        day : day1,
        month : month1,
        year : year1
      },
      date2 : {
        day : day2,
        month : month2,
        year : year2
      }
    }
    return this.http.post(`${this.uri}/getResultsBettwenTwoDates`, data);
  }
}
