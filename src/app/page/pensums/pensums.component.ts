import { Component, inject } from '@angular/core';
import { CardsPensumComponent } from '../../components/shared/cards-pensum/cards-pensum.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PATH } from '../../core/enum/path.enum';
import { PensumsService } from '../../services/pensum/pensum.service';
import Swal from 'sweetalert2';
import { PensumModel } from '../../core/models/pensum.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pensums',
  standalone: true,
  imports: [ ReactiveFormsModule],
  templateUrl: './pensums.component.html',
  styleUrl: './pensums.component.css',
})
export class PensumsComponent {
  pensumForm!: FormGroup;
  pensumSeleccionado!: PensumModel;

  private formBuilder = inject(FormBuilder);
  pensumServices = inject(PensumsService);
  private router = inject(Router);

  pensumSubscription!: Subscription;

  esEditar: boolean = false;
  activarCrearPensum: boolean = false;
  pensums: any = [];

  ngOnInit(): void {
    this.pensumServices.getPensums().subscribe({
      next: (resp: any) => {
        this.pensums = resp.pensum
      },
      error: (error) => {
        console.error('Error al obtener los pensum:', error);
      },
    });
  
    this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.pensumSubscription?.unsubscribe();
  }

  cargarPensums() {
    this.pensumServices.getPensums().subscribe({
      next: (resp: any) => {
        this.pensums = resp.pensum;
      },
      error: (error) => {
        console.error('Error al cargar las pensum:', error);
        Swal.fire('Error', 'No se pudieron cargar las pensum.', 'error');
      },
    });
  }

  crearFormulario() {
    this.pensumForm = this.formBuilder.group({
      _id: [null],
      nombre: ['', [Validators.required]],
      facultad: ['', [Validators.required]],
      idPensum: ['', [Validators.required]],
      semestresTotales: ['', [Validators.required]],
      creditosTotales: ['', [Validators.required]],
    });
  }

  crearPensum() {
    this.activarCrearPensum = !this.activarCrearPensum; // Alterna el estado del div
    if (this.activarCrearPensum) {
      this.limpiarFormulario(); // Limpia el formulario al mostrar el modal
    }

    if (!this.pensumForm.valid) {
      Swal.fire(
        'Crear o Actualizar la pensum',
        'Por favor complete el formulario',
        'info'
      );
      return;
    }

    const data = this.pensumForm.value;

    if (data._id) {
      this.pensumServices.actualizarPensum(data._id, data).subscribe({
        next: (res: any) => {
          Swal.fire({
            icon: 'success',
            title: `La pensum se ha sido actualizado con éxito`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1400,
          });
          this.cargarPensums();
        },
        error: (error) => {
          const errorMsg = error?.error?.msg || 'Ocurrió un error inesperado';
          Swal.fire('Error', errorMsg, 'error');
        },
      });
    } else {
      this.pensumServices.crearPensum(data).subscribe({
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
            title: `La pensum ha sido actualizado con éxito`,
          });
          this.cargarPensums();
        },
        error: (error) => {
          const errorMsg = error?.error?.msg || 'Ocurrió un error inesperado';
          Swal.fire('Error', errorMsg, 'error');
        },
      });
    }
  }

  editarPensum(data: any): void {
    this.esEditar = true;
    this.activarCrearPensum = true;

    // Populate the form with the selected user's data for editing
    this.pensumSeleccionado = data;
    this.pensumForm.patchValue({
      _id: this.pensumSeleccionado._id,
      nombre: this.pensumSeleccionado.nombre,
      facultad: this.pensumSeleccionado.facultad,
      idPensum: this.pensumSeleccionado.idPensum,
      semestresTotales: this.pensumSeleccionado.semestresTotales,
      creditosTotales: this.pensumSeleccionado.creditosTotales,
    });
  }

  actualizarPensum(): void {
    if (this.pensumForm.valid) {
      const updatedPensum = this.pensumForm.value;

      this.pensumServices
        .actualizarPensum(this.pensumSeleccionado._id, updatedPensum)
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
              title: `la pensum ${updatedPensum.nombre} ha sido actualizada con éxito`,
            });
            // Optionally reset the form or close it after submission
            this.pensumForm.reset();
            this.activarCrearPensum = false;
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

  eliminarPensum(data: PensumModel) {
    // Mostrar confirmación antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la pensum ${data.nombre}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio de eliminación
        this.pensumServices.eliminarPensum(data._id).subscribe({
          next: (res: any) => {
            this.pensums = this.pensums.filter(
              (pensum: PensumModel) => pensum._id !== data._id
            );

            Swal.fire(
              'Pensum eliminada',
              `La pensum ${data.nombre} ha sido eliminada con éxito`,
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

  verPensum(data: PensumModel) {
    this.router.navigate([`/${PATH.PENSUM_DETALLE}`], {
      state: { pensumId: data._id },
    });
  }

  limpiarFormulario(): void {
    this.pensumForm.reset();
    this.pensumSeleccionado;
  }

  modalCrearPensum() {
    if (this.activarCrearPensum) {
      this.esEditar = false;
      this.limpiarFormulario(); // Limpia el formulario si se abre el modal
    }
    this.activarCrearPensum = !this.activarCrearPensum; // Alterna el estado del modal
  }
}
