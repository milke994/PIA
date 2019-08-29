import { Component, OnInit } from '@angular/core';
import {UsersService} from '../users.service';
import {Router} from '@angular/router';
import { NgForm } from '@angular/forms';

var jimp = require('jimp');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // name : String;
  // lastname : String;
  // mail : String;
  // occupation : String;
  // username : String;
  // password : String;
  // password2 : String;
  // genre : String;
  // jmbg : String;
  // secretQuestion : String;
  // secretAnswer : String;
  selectedFile : File = null;
  imgUrl = null;
  imagename : String = null;

  message : String;

  constructor(private service : UsersService, private router: Router) { }

  ngOnInit() {
    this.message = null;
    var hide1 = false;
    var hide2 = false;
  }

  register(form : NgForm):void{
    if(form.invalid) return;
    if(form.value.password != form.value.password2){
      this.message = "Your passwords dont match!";
      return;
    }
    if(this.selectedFile != null){
      this.imagename = this.selectedFile.name;
    }
    console.log(this.imagename);
    this.service.register(form.value.name, form.value.lastname, form.value.mail, form.value.occupation, 
      form.value.username, form.value.password, form.value.genre, form.value.jmbg, form.value.secretQuestion, 
      form.value.secretAnswer, this.imgUrl, "user", false).subscribe((user)=>{
      if(user){
        this.router.navigate(['/login']);
      } else{
        this.message = "Username " + form.value.username + " already taken";
      }
    })
  }

  cancel(){
    this.router.navigate(['/login']);
  }

  onFileSelected(event){
    this.selectedFile = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event:any)=> {
      this.imgUrl = event.target.result;
      jimp.read(this.imgUrl).then(image =>{
        let width = image.bitmap.width;
        let height = image.bitmap.height;
        if(width > 300 || height > 300){
          this.message = "Picture width and height must be smaller then 300px";
        } else {
          if(this.message == "Picture width and height must be smaller then 300px"){
            this.message = null;
          }
        }
      })
      .catch(err =>{
        console.log(err);
      });
    }
    reader.readAsDataURL(this.selectedFile);
  }

}
