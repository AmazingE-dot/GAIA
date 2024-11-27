import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MateriaModel } from '../../core/models/materia.model';
import { MateriasService } from '../../services/materias/materias.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.css'
})
export class MateriasComponent {

  materiasForm!: FormGroup;
  materiaSeleccionado!: MateriaModel;

  private formBuilder = inject(FormBuilder);
  materiasServices = inject(MateriasService);
  private router = inject(Router);

  materiaSubscription!: Subscription;
  
  esEditar: boolean = false
  activarCrearMateria: boolean = false;
  materias: any = [];


  ngOnInit(): void {
    this.materiasServices.getMaterias().subscribe((resp: any) => {
      this.materias = resp.materias;
    console.log(this.materias)

    });
  
    this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.materiaSubscription?.unsubscribe();
  }

  cargarMaterias() {
    this.materiasServices.getMaterias().subscribe({
      next: (resp: any) => {
        this.materias = resp.materias;
      },
      error: (error) => {
        console.error('Error al cargar las materias:', error);
        Swal.fire('Error', 'No se pudieron cargar las materias.', 'error');
      }
    });
  }

  crearFormulario() {
    this.materiasForm = this.formBuilder.group({
      _id: [null],
      nombre: ['', [Validators.required]],
      materiaCodigo: ['', [Validators.required]],
      curso: ['', [Validators.required]],
      seccion: ['', [Validators.required]],
      semestre: ['', [Validators.required]],
      creditos: ['', [Validators.required]],
    });
  }


  crearMateria() {
    this.activarCrearMateria = !this.activarCrearMateria; // Alterna el estado del div
    if (this.activarCrearMateria) {
      this.limpiarFormulario(); // Limpia el formulario al mostrar el modal
    }
  
    if (!this.materiasForm.valid) {
      Swal.fire(
        'Crear o Actualizar la materia',
        'Por favor complete el formulario',
        'info'
      );
      return;
    }
   
    const data = this.materiasForm.value;
  
    if (data._id) {
      this.materiasServices.actualizarMateria(data._id, data).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: `La materia se ha sido actualizado con éxito`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1400,
          });
          this.cargarMaterias(); 
        },
        error: (error) => {
          const errorMsg = error?.error?.msg || 'Ocurrió un error inesperado';
          Swal.fire('Error', errorMsg, 'error');
        },
      });
    } else {
      this.materiasServices.crearMateria(data).subscribe({
        next: (res: any) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            title: `La materia ha sido actualizado con éxito`,
          });
          this.cargarMaterias();
        },
        error: (error) => {
          const errorMsg = error?.error?.msg || 'Ocurrió un error inesperado';
          Swal.fire('Error', errorMsg, 'error');
        },
      });
    }
  }

  editarMateria(data: any): void {
    this.esEditar = true
    this.activarCrearMateria = true;


    // Populate the form with the selected user's data for editing
    this.materiaSeleccionado = data;
    this.materiasForm.patchValue({
      _id: this.materiaSeleccionado._id,
      nombre: this.materiaSeleccionado.nombre,
      materiaCodigo: this.materiaSeleccionado.materiaCodigo,
      curso: this.materiaSeleccionado.curso,
      seccion: this.materiaSeleccionado.seccion,
      semestre: this.materiaSeleccionado.semestre,
      creditos: this.materiaSeleccionado.creditos,
    });
  }
 
  actualizarMateria(): void {
    if (this.materiasForm.valid) {
      const updatedMateria = this.materiasForm.value;

      this.materiasServices
        .actualizarMateria(this.materiaSeleccionado._id, updatedMateria)
        .subscribe({
          next: (res: any) => {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              },
            });
            Toast.fire({
              icon: 'success',
              title: `la materia ${updatedMateria.nombre} ha sido actualizada con éxito`,
            });
            // Optionally reset the form or close it after submission
            this.materiasForm.reset();
            this.activarCrearMateria = false;
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

  eliminarMateria(data: MateriaModel) {
    // Mostrar confirmación antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la materia ${data.nombre}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio de eliminación
        this.materiasServices.eliminarMateria(data._id).subscribe({
          next: (res: any) => {

            this.materias = this.materias.filter(
              (materia: MateriaModel) => materia._id !== data._id
            );

            Swal.fire(
              'Materia eliminada',
              `La materia ${data.nombre} ha sido eliminada con éxito`,
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

  limpiarFormulario(): void {
    this.materiasForm.reset();
    this.materiaSeleccionado;
  }
  

  modalCrearMateria() {
    if (this.activarCrearMateria) {
      this.esEditar = false
      this.limpiarFormulario(); // Limpia el formulario si se abre el modal
    }
  this.activarCrearMateria = !this.activarCrearMateria; // Alterna el estado del modal  
  }
}
