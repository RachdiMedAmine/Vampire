import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GamesComponent } from './games/games.component';
import { AnimesComponent } from './animes/animes.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FooterComponent } from './footer/footer.component';

const routes: Routes = [
  {path :"", component : HomeComponent },
  {path : "home", component : HomeComponent},
  {path : "games", component : GamesComponent},
  {path : "animes", component : AnimesComponent},
  {path : "login", component : LoginComponent},
  {path : "signup", component : SignupComponent},
  {path : "footer", component : FooterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
