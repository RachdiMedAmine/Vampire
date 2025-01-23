import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize the form group with form controls and validators
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9]).+$') // At least one letter and one number
        ]
      ],
      passwordConfirm: ['', [Validators.required]]
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    const formData = this.signupForm.value;

    // Send POST request to the API with credentials
    this.http.post('http://localhost:3000/api/v1/users/signup', formData, {
      withCredentials: true // Include credentials (cookies)
    }).subscribe({
      next: () => {
        // Redirect to the home page on success
        this.router.navigate(['/']);
      },
      error: (err) => {
        // Display error message from the API
        this.errorMessage = err.error.message || 'Signup failed. Please try again.';
      }
    });
  }
}
