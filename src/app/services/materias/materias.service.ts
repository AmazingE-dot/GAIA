import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MateriaModel } from "../../core/models/materia.model";
import { catchError, Observable, throwError } from "rxjs";
import Swal from "sweetalert2";
import { MateriasResponse } from "../../core/models/pensum.model";


@Injectable({
  providedIn: 'root',
})
export class MateriasService {
  private readonly API_URL = 'http://localhost:4000/api/v1/materia'; // Base de URL
  private router = inject(Router);

  constructor(private httpClient: HttpClient) {}

 private getHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  return new HttpHeaders({
    'x-token': token,
  });
}

  getMaterias(): Observable<MateriasResponse> {
    return this.httpClient.get<MateriasResponse>(this.API_URL, {
      headers: this.getHeaders(),
    });
  }

  crearMateria(materia: MateriaModel) {
    return this.httpClient
      .post(this.API_URL, materia, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          const errorMsg = error.error?.errors
            ? error.error.errors.map((err: any) => err.msg).join(', ')
            : 'Ocurrió un error al crear la materia.';
          
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMsg,
          });

          return throwError(() => error);
        })
      );
  }

  actualizarMateria(id: string, materia: MateriaModel) {
    return this.httpClient
      .put(`${this.API_URL}/${id}`, materia, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          const errorMsg = error.error?.errors
            ? error.error.errors.map((err: any) => err.msg).join(', ')
            : 'Ocurrió un error al actualizar la materia.';

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMsg,
          });

          return throwError(() => error);
        })
      );
  }

  eliminarMateria(id: string) {
    return this.httpClient.delete(`${this.API_URL}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getMateriasConteo() {
    return this.httpClient.get(`${this.API_URL}/conteos`, {
      headers: this.getHeaders(), // Usa el método centralizado para los encabezados
    });
  }
}
