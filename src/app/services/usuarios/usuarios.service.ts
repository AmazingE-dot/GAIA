import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginInterface } from '../../core/interface/login.interface';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PATH } from '../../core/enum/path.enum';
import { UsuarioModel } from '../../core/models/usuario.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly API_URL = 'http://localhost:4000/api/v1/usuario'; // Base de URL
  private router = inject(Router);

  constructor(private httpClient: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'x-token': token ? `${token}` : '', // Valida el token
    });
  }

  login(login: LoginInterface) {
    return this.httpClient
      .post('http://localhost:4000/api/v1/login', login)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl(PATH.LOGIN);
  }

  getUsuarios() {
    return this.httpClient.get(this.API_URL, {
      headers: this.getHeaders(), // Usa el método centralizado para los encabezados
    });
  }

  crearUsuario(usuario: UsuarioModel) {
    return this.httpClient
      .post(this.API_URL, usuario, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          const errorMsg = error.error?.errors 
            ? error.error.errors.map((err: any) => err.msg).join(', ') 
            : 'Ocurrió un error al crear el usuario.';
          
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMsg,
          });
  
          return throwError(() => error);
        })
      );
  }  

  eliminarUsuario(id: string) {
    return this.httpClient.delete(`${this.API_URL}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
