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
      apellido2: ['', ],
      password: ['', [Validators.required]],
      rol: ['', ],
      tipoDocumento: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      tipoCarrera: ['', []],
      modalidad: ['', []],
      carrera: ['', []],
      fechaNacimiento: ['', [Validators.required]],
      idEstu: ['', ],
    });
  }

  crearUsuario() {
    if (!this.usuariosForm.valid) {
      // Mostrar los errores específicos de cada campo
      for (const controlName in this.usuariosForm.controls) {
        const control = this.usuariosForm.get(controlName);
        if (control && control.invalid) {
          console.log(`${controlName} es inválido`, control.errors);  // Esto te dará detalles de los errores
        }
      }
      Swal.fire('Crear usuario', 'Por favor complete el formulario', 'info');
      return;
    }
  
    const data = this.usuariosForm.value;
  
    console.log('Datos del formulario:', data);  // Para depurar
  
    const usuarioNuevo: UsuarioModel = new UsuarioModel(
      data._id,
      data.nombre,
      data.apellido1,
      data.apellido2,
      data.password,
      data.rol,
      data.tipoDocumento,
      data.documento,
      data.correo,
      data.celular,
      data.tipoCarrera,
      data.modalidad,
      data.carrera,
      data.idEstu,
      new Date(data.createdAt || Date.now()),
      data.token || '',
      data.horario || [],
      data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined
    );
  
    if (usuarioNuevo) {
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
          const errorMsg = error?.error?.msg || 'Ocurrió un error inesperado';
          Swal.fire('Error', errorMsg, 'error');
        }
      });
    }
  }
  
  
  

  eliminarUsuario(data: UsuarioModel) {
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
            // Filtrar la lista de usuarios para eliminar el usuario eliminado
            this.usuarios = this.usuarios.filter((usuario: UsuarioModel) => usuario._id !== data._id);
  
            Swal.fire(
              'Usuario eliminado',
              `El usuario ${data.nombre} ha sido eliminado con éxito`,
              'success'
            );
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
