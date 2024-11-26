import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios/usuarios.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  
  conteos = {
    estudiantes: 0,
    administradores: 0,
    profesores: 0,
  };

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void { 
    this.usuariosConteos();
  }

  usuariosConteos() {
    this.usuariosService.getUsuariosConteo().subscribe({
      next: (resp: any) => {
        this.conteos.estudiantes = resp.estudiantes;
        this.conteos.administradores = resp.administradores;
        this.conteos.profesores = resp.profesores;        
      },
      error: (error) => {
        console.error('Error al cargar los conteos:', error);
      },
    });
  }


}
