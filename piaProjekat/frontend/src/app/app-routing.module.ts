import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LoginComponent} from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SecretquestionComponent } from './secretquestion/secretquestion.component';
import { SupervisorComponent } from './supervisor/supervisor.component';
import { GuestComponent } from './guest/guest.component';
import { GameOfTheDayComponent } from './game-of-the-day/game-of-the-day.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: UserComponent},
  {path: 'admin', component: AdminComponent},
  {path: '', component: LoginComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'secret-question', component: SecretquestionComponent},
  {path: 'supervisor', component: SupervisorComponent},
  {path: 'guest', component: GuestComponent},
  {path: 'gameOfTheDay', component:GameOfTheDayComponent},
  {path: 'results', component:ResultComponent}
]

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
