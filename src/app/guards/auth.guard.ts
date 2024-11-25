import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UsuariosService } from '../services/usuarios/usuarios.service'; // Ajusta la ruta según tu estructura
import { PATH } from '../core/enum/path.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const usuariosService = inject(UsuariosService);
  const token = localStorage.getItem('token'); // Valida si hay un token almacenado

  if (token) {
    return true; // Permite el acceso si hay un token
  } else {
    usuariosService.logOut(); // Redirige al login si no hay token
    return false;
  }
};
