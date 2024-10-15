import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioModel } from '../../core/models/usuario.model';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterOutlet, UsuariosComponent, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit, OnDestroy {

  usuariosForm!: FormGroup;
  usuarioSeleccionado!: UsuarioModel;

  private formBuilder = inject(FormBuilder);
  usuariosServices = inject(UsuariosService);
  private router = inject(Router);
  
  usuarioSubscription!: Subscription;
  
  activarCrearUsuario: boolean = false;

  usuarios: any = [];

  ngOnInit(): void {
    this.usuariosServices.getUsuarios().subscribe((resp: any) => {
      // console.log('respuesta de la api', resp.usuarios);
      this.usuarios = resp.usuarios;
    });

    this.crearFormulario();
  }
  
  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
  }

  crearFormulario() {
    this.usuariosForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido1: ['', [Validators.required]],
      apellido2: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      tipoDocumento: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      tipoCarrera: ['', [Validators.required]],
      modalidad: ['', [Validators.required]],
      carrera: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      idEstu: ['', [Validators.required]],
    });
  }

  crearUsuario() {
    if (!this.usuariosForm.valid) {
      Swal.fire('Crear usuario', 'POr favor complete el formulario', 'info');
    }

    const data = this.usuariosForm.value;
    const usuarioNuevo: UsuarioModel = {
      nombre: data.nombre,
      apellido1: data.apellido1,
      apellido2: data.apellido2,
      rol: data.rol,
      tipoDocumento: data.tipoDocumento,
      documento: data.documento,
      correo: data.correo,
      tipoCarrera: data.tipoCarrera,
      carrera: data.carrera,
      idEstu: data.idEstu,
      celular: data.celular,
      modalidad: data.modalidad,
      password: data.password,
      _id: data._id
    };
    {
      this.usuariosServices.crearUsuario(usuarioNuevo).subscribe({
        next: (res: any) => {
          Swal.fire(
            'Usuario',
            `El usuario ${data.nombre} ha sido creado con éxito`,
            'success'
          );
          location.reload();
        },
        error: (error) => {
          Swal.fire('Error', `${error.error.msg}`, 'error');
        },
      });
    }
  }

  eliminarUsuario(data: UsuarioModel) {
    this.usuarios = data._id;
    
    // Mostrar confirmación antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el usuario ${data.nombre}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio de eliminación
        this.usuariosServices.eliminarUsuario(data._id).subscribe({
          next: (res: any) => {
            Swal.fire(
              'Usuario eliminado',
              `El usuario ${data.nombre} ha sido eliminado con éxito`,
              'success'
            );
  
            // Recargar la lista de usuarios o actualiza la vista
            location.reload(); // Método para recargar los usuarios
          },
          error: (error) => {
            Swal.fire('Error', `${error.error.msg}`, 'error');
          },
        });
      }
    });
  }

  modalCrearUsuario() {
    if (this.activarCrearUsuario == false) {
      this.activarCrearUsuario = true;
    } else {
      this.activarCrearUsuario = false;
    }
  }
}
