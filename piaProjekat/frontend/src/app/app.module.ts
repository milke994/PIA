import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { UsersService } from './users.service';

import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule, MatCardModule, MatButtonModule, 
  MatIconModule, MatToolbarModule, MatRadioModule, MatSelectModule} from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SecretquestionComponent } from './secretquestion/secretquestion.component';
import { GuestComponent } from './guest/guest.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { GameOfTheDayComponent } from './game-of-the-day/game-of-the-day.component';
import { ResultComponent } from './result/result.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    ResetPasswordComponent,
    SecretquestionComponent,
    GuestComponent,
    SupervisorComponent,
    GameOfTheDayComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
