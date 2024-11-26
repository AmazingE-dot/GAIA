import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuarioModel } from '../../core/models/usuario.model';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { PensumService } from '../../services/pensum/pensum.service';
import { PensumModel } from '../../core/models/pensum.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [ ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit, OnDestroy {
  usuariosForm!: FormGroup;
  usuarioSeleccionado!: UsuarioModel;

  private formBuilder = inject(FormBuilder);
  usuariosServices = inject(UsuariosService);
  pensumService = inject(PensumService);
  private router = inject(Router);

  usuarioSubscription!: Subscription;
  
  activarCrearUsuario: boolean = false;
  usuarios: any = [];
  pensum: any = [];


  ngOnInit(): void {
    this.usuariosServices.getUsuarios().subscribe((resp: any) => {
      this.usuarios = resp.usuarios;
    });

    this.pensumService.getPensums().subscribe({
      next: (resp: any) => {
        console.log('respuesta de la API:', resp.pensum);
        this.pensum = resp.pensum;
      },
      error: (error) => {
        console.error('Error al obtener los pensum:', error);
      },
    });
  
    this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.usuarioSubscription?.unsubscribe();
  }

  crearFormulario() {
    this.usuariosForm = this.formBuilder.group({
      _id: [null],
      nombre: ['', [Validators.required]],
      apellido1: ['', [Validators.required]],
      apellido2: [''],
      password: ['', [Validators.required]],
      rol: [''],
      tipoDocumento: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      tipoCarrera: ['', []],
      modalidad: ['', []],
      carrera: ['', []],
      fechaNacimiento: [''],
      idEstu: [''],
    });
  }

  crearUsuario() {
    this.activarCrearUsuario = !this.activarCrearUsuario; // Alterna el estado del div
    if (this.activarCrearUsuario) {
      this.limpiarFormulario(); // Limpia el formulario al mostrar el modal
    }
    
    if (!this.usuariosForm.valid) {
      // Mostrar los errores específicos de cada campo
      for (const controlName in this.usuariosForm.controls) {
        const control = this.usuariosForm.get(controlName);
      }
      Swal.fire(
        'Crear o Actualizar usuario',
        'Por favor complete el formulario',
        'info'
      );
      return;
    }

    const data = this.usuariosForm.value;

    // Si el usuario tiene _id, se trata de una actualización
    if (data._id) {
      // Si el correo es el mismo, no validamos
      this.usuariosServices.actualizarUsuario(data._id, data).subscribe({
        next: (res: any) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1400,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            title: `El usuario ha sido actualizado con éxito`,
          });
          this.cargarUsuarios();
        },
        error: (error) => {
          const errorMsg = error?.error?.msg || 'Ocurrió un error inesperado';
          Swal.fire('Error', errorMsg, 'error');
        },
      });
    } else {
      // Si no tiene _id, es un nuevo usuario
      this.usuariosServices.crearUsuario(data).subscribe({
        next: (res: any) => {
          Swal.fire(
            'Usuario creado',
            `El usuario ${data.nombre} ha sido creado con éxito`,
            'success'
          );
        },
        error: (error) => {
          const errorMsg = error?.error?.msg || 'Ocurrió un error inesperado';
          Swal.fire('Error', errorMsg, 'error');
        },
      });
    }
  }

  editarUsuario(data: any): void {
    this.activarCrearUsuario = true;

    // Populate the form with the selected user's data for editing
    this.usuarioSeleccionado = data;
    this.usuariosForm.patchValue({
      _id: this.usuarioSeleccionado._id,
      nombre: this.usuarioSeleccionado.nombre,
      apellido1: this.usuarioSeleccionado.apellido1,
      apellido2: this.usuarioSeleccionado.apellido2,
      rol: this.usuarioSeleccionado.rol,
      tipoDocumento: this.usuarioSeleccionado.tipoDocumento,
      documento: this.usuarioSeleccionado.documento,
      password: this.usuarioSeleccionado.password,
      correo: this.usuarioSeleccionado.correo,
      celular: this.usuarioSeleccionado.celular,
      tipoCarrera: this.usuarioSeleccionado.tipoCarrera,
      modalidad: this.usuarioSeleccionado.modalidad,
      carrera: this.usuarioSeleccionado.carrera,
      idEstu: this.usuarioSeleccionado.idEstu,
      fechaNacimiento: this.usuarioSeleccionado.fechaNacimiento,
    });
  }

  // Handle form submission and update the user
  actualizarUsuario(): void {
    if (this.usuariosForm.valid) {
      const updatedUser = this.usuariosForm.value;

      // If password was changed, handle it properly
      if (updatedUser.password) {
        updatedUser.password = updatedUser.password; // Ensure password is sent if changed
      }

      this.usuariosServices
        .actualizarUsuario(this.usuarioSeleccionado._id, updatedUser)
        .subscribe({
          next: (res: any) => {
            Swal.fire(
              'Usuario actualizado',
              `El usuario ${updatedUser.nombre} ha sido actualizado con éxito`,
              'success'
            );
            // Optionally reset the form or close it after submission
            this.usuariosForm.reset();
            this.activarCrearUsuario = false;
          },
          error: (error) => {
            Swal.fire('Error', `${error.error.msg}`, 'error');
          },
        });
    } else {
      Swal.fire(
        'Formulario inválido',
        'Por favor, complete todos los campos correctamente',
        'warning'
      );
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
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio de eliminación
        this.usuariosServices.eliminarUsuario(data._id).subscribe({
          next: (res: any) => {
            // Filtrar la lista de usuarios para eliminar el usuario eliminado
            this.usuarios = this.usuarios.filter(
              (usuario: UsuarioModel) => usuario._id !== data._id
            );

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

  cargarUsuarios() {
    this.usuariosServices.getUsuarios().subscribe({
      next: (resp: any) => {
        this.usuarios = resp.usuarios; // Actualiza la lista de usuarios sin recargar la página
      },
      error: (error) => {
        console.error('Error al cargar los usuarios:', error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
      }
    });
  }

  limpiarFormulario(): void {
    this.usuariosForm.reset(); // Resetea todos los valores del formulario
    this.usuarioSeleccionado; // Limpia cualquier usuario seleccionado
  }
  

  modalCrearUsuario() {
    
    this.activarCrearUsuario = !this.activarCrearUsuario; // Alterna el estado del modal

    if (this.activarCrearUsuario) {
      this.limpiarFormulario(); // Limpia el formulario si se abre el modal
    }
  }
}
