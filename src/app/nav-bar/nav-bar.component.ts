import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  userImage: string = ''; // Replace with the actual URL of the user image
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Check if the user is logged in
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getUserData();
      this.userName = user ? user.fullName : 'Rachdi Med Amine'; // Assuming fullName exists in the user data
      this.userImage = 'default.jpg'; // Provide the correct image URL or path
    }
  }
}
