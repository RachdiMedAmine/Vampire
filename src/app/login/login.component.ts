import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Import necessary modules
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({ // Initialize loginForm immediately
    email: ['', [Validators.required, Validators.email]],  
    password: ['', [Validators.required, Validators.minLength(6)]]
  }); 
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, // Inject FormBuilder
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // You don't need to initialize loginForm here anymore
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return; // Prevent submission if the form is invalid
    }

    const user = this.loginForm.value;
    this.authService.login(user).subscribe(
      (response: any) => {
        this.authService.saveToken(response.token);
        this.authService.saveUserData(response.user);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
      }
    );
  }
}

