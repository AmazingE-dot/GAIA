import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios/usuarios.service';
// Importa jwtDecode correctamente
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  private usuarioService = inject(UsuariosService);
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isEstudiante: boolean = false;
  isProfesor: boolean = false;

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;

      try {
        const decodedToken: any = jwtDecode(token);
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
    this.isLoggedIn = false;
    this.isAdmin = false;
  }

  toggleMenu() {
    const menuMobile = document.getElementById('menuMobile');
    if (menuMobile) {
      menuMobile.classList.toggle('hidden');
    }
  }
}
