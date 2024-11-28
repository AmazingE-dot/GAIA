import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { PensumModel } from '../../core/models/pensum.model';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})

export class PensumsService {
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
      headers: this.getHeaders(), // Usa el método centralizado para los encabezados
    });
  }

  getUnPensum(id: string) {
    return this.httpClient.get(`${this.API_URL}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  crearPensum(pensum: PensumModel) {
    return this.httpClient
      .post(this.API_URL, pensum, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          const errorMsg = error.error?.errors
            ? error.error.errors.map((err: any) => err.msg).join(', ')
            : 'Ocurrió un error al crear el pensum.';

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMsg,
          });

          return throwError(() => error);
        })
      );
  }

  actualizarPensum(id: string, pensum: PensumModel) {
    return this.httpClient
      .put(`${this.API_URL}/${id}`, pensum, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          const errorMsg = error.error?.errors
            ? error.error.errors.map((err: any) => err.msg).join(', ')
            : 'Ocurrió un error al actualizar el pensum.';

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMsg,
          });

          return throwError(() => error);
        })
      );
  }

  eliminarPensum(id: string) {
    return this.httpClient.delete(`${this.API_URL}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}

