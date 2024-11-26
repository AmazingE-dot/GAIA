import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core'; 
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root',
})
export class PensumService {
  private readonly API_URL = 'http://localhost:4000/api/v1/pensum'; // Base de URL
  private router = inject(Router);

  constructor(private httpClient: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'x-token': token ? `${token}` : '', // Valida el token
    });
  }
  
  getPensums() {
    return this.httpClient.get(this.API_URL, {
      headers: this.getHeaders(),
    });
  }
  
}
