import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getGames(): Observable<any> {
    return this.http.get(`${this.baseUrl}/games`);
  }

  getAnimes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/animes`);
  }
}
