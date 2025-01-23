import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/users/signup'; // Adjust based on your Node.js server's URL
  private loginUrl = 'http://localhost:3000/api/v1/users/login'; // Add your login API URL here

  constructor(private http: HttpClient) {}

  // Signup function
  signup(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  // Login function
  login(user: any): Observable<any> {
    return this.http.post(this.loginUrl, user);
  }

  // Check if the user is logged in by checking the localStorage
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      // Only access localStorage in the browser environment
      return !!localStorage.getItem('userToken'); // Assuming userToken is saved in localStorage after login
    }
    return false; // Return false if not in the browser environment
  }

  // Save token to localStorage
  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userToken', token);
    }
  }

  // Save user data to localStorage
  saveUserData(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userData', JSON.stringify(user));
    }
  }

  // Get token from localStorage
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userToken');
    }
    return null;
  }

  // Get user data from localStorage
  getUserData(): any {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Logout function to clear localStorage
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
    }
  }
}
