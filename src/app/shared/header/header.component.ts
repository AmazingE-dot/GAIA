import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
// Importa jwtDecode correctamente
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private usuarioService = inject(UsuariosService);
  isLoggedIn: boolean = false; // Indica si el usuario está autenticado
  isAdmin: boolean = false; // Indica si el usuario tiene el rol de ADMIN
  isEstudiante: boolean = false; // Indica si el usuario tiene el rol de ADMIN
  isProfesor: boolean = false; // Indica si el usuario tiene el rol de Profesor

  ngOnInit() {
    this.checkLoginStatus(); // Verificar el estado de autenticación al iniciar
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;

      try {
        // Decodificar el token para extraer el rol
        const decodedToken: any = jwtDecode(token);

        // Verificar si el rol es ADMIN (ajustado a 'rol')
        this.isAdmin = decodedToken.rol === 'ADMIN';
        this.isProfesor = decodedToken.rol === 'Profesor';
        this.isEstudiante = decodedToken.rol === 'Estudiante';
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.isEstudiante = false;
        this.isProfesor = false;
      }
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.isEstudiante = false;
      this.isProfesor = false;
    }
  }

  cerrarSesion() {
    this.usuarioService.logOut();
    this.isLoggedIn = false; // Cambiar el estado después de cerrar sesión
    this.isAdmin = false;
  }
}
