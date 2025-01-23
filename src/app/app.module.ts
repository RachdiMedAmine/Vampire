import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { GamesComponent } from './games/games.component';
import { AnimesComponent } from './animes/animes.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './footer/footer.component';

import { HttpClientModule } from '@angular/common/http'; // Added for API communication
import { ReactiveFormsModule } from '@angular/forms'; // Added for reactive forms

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    GamesComponent,
    AnimesComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule, // Added
    ReactiveFormsModule // Added
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
