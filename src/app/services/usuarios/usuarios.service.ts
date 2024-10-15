import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginInterface } from '../../core/interface/login.interface';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { PATH } from '../../core/enum/path.enum';
import { UsuarioModel } from '../../core/models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  private router = inject(Router)

  constructor(private httpClient: HttpClient) {}

  login(login: LoginInterface){
    return this.httpClient.post('http://localhost:4000/api/v1/login', login).pipe(tap((resp: any) => {
      localStorage.setItem('token', resp.token)
    }))
  }

  logOut(){
    localStorage.removeItem('token')
    this.router.navigateByUrl(PATH.LOGIN)
  }

  getUsuarios() {
    return this.httpClient.get('http://localhost:4000/api/v1/usuario');
  }

  crearUsuario(usuario: UsuarioModel) {
    return this.httpClient.post(`http://localhost:4000/api/v1/usuario`, usuario);
  }

  eliminarUsuario(id: string) {
    return this.httpClient.delete(`http://localhost:4000/api/v1/usuario/${id}`);
  }

}
