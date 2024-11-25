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
      Swal.fire('Crear o Actualizar usuario', 'Por favor complete el formulario', 'info');
      return;
    }
  
    const data = this.usuariosForm.value;
    console.log('Datos del formulario:', data);  // Para depurar y asegurarte de que los datos son correctos
  
    // Si el usuario tiene _id, se trata de una actualización
    if (data._id) {
      console.log('Actualizando usuario con _id:', data._id);
      // Si el correo es el mismo, no validamos
      this.usuariosServices.actualizarUsuario(data._id, data).subscribe({
        next: (res: any) => {
          Swal.fire(
            'Usuario actualizado',
            `El usuario ${data.nombre} ha sido actualizado con éxito`,
            'success'
          );
          // No recargar la página, solo actualizar la vista
          this.actualizarVistaUsuario(res.usuario); // Asumiendo que el backend responde con el usuario actualizado
        },
        error: (error) => {
          const errorMsg = error?.error?.msg || 'Ocurrió un error inesperado';
          Swal.fire('Error', errorMsg, 'error');
        }
      });
    } else {
      console.log('Creando nuevo usuario...');
      // Si no tiene _id, es un nuevo usuario
      this.usuariosServices.crearUsuario(data).subscribe({
        next: (res: any) => {
          Swal.fire(
            'Usuario creado',
            `El usuario ${data.nombre} ha sido creado con éxito`,
            'success'
          );
          // No recargar la página, solo actualizar la vista
          this.actualizarVistaUsuario(res.usuario); // Asumiendo que el backend responde con el nuevo usuario
        },
        error: (error) => {
          const errorMsg = error?.error?.msg || 'Ocurrió un error inesperado';
          Swal.fire('Error', errorMsg, 'error');
        }
      });
    }
    console.log('Datos del formulario:', data);
  }
  
  // Este método podría ser para actualizar la vista del usuario en la interfaz
  actualizarVistaUsuario(usuario: UsuarioModel) {
    // Actualiza la vista con el usuario actualizado
    console.log('Usuario actualizado en la vista:', usuario);
    // Aquí podrías actualizar la vista, por ejemplo, con un binding de datos
  }
  
  
  

  editarUsuario(data: any): void {
    this.activarCrearUsuario = true;

    // Populate the form with the selected user's data for editing
    this.usuarioSeleccionado = data;
    this.usuariosForm.patchValue({
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
      fechaNacimiento: this.usuarioSeleccionado.fechaNacimiento
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
  
      this.usuariosServices.actualizarUsuario(this.usuarioSeleccionado._id, updatedUser).subscribe({
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
        }
      });
    } else {
      Swal.fire('Formulario inválido', 'Por favor, complete todos los campos correctamente', 'warning');
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
