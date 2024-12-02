import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PensumsService } from '../../services/pensum/pensum.service';
import { MateriasService } from '../../services/materias/materias.service';
import { CardsPensumComponent } from '../../components/shared/cards-pensum/cards-pensum.component';
import { PATH } from '../../core/enum/path.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MateriaModel } from '../../core/models/materia.model';

@Component({
  selector: 'app-pensum-detalle',
  templateUrl: './pensum-detalle.component.html',
  standalone: true,
  styleUrls: ['./pensum-detalle.component.css'],
  imports: [CardsPensumComponent, ReactiveFormsModule],
})
export class PensumDetalleComponent implements OnInit {
  materiasDisponibles: MateriaModel[] = [];
  totalSemestres: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  materiasAgrupadasPorSemestre: { [key: number]: { nombre: string; estado: string }[] } = {};

  pensum: any = {
    nombre: '',
    materiaCodigo: [],
  };

  materiaApensumForm!: FormGroup;
  activarCrearPensumD: boolean = false;
  pensumId!: string;
  console: any;


  constructor(
    private router: Router,
    private PensumsService: PensumsService,
    private MateriasService: MateriasService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    const pensumId = history.state?.pensumId;
  
    if (pensumId) {
      this.pensumId = pensumId;
  
      this.PensumsService.getUnPensum(pensumId).subscribe({
        next: (response: any) => {
          console.log('Pensum cargado:', response.pensum);
          this.pensum = response.pensum;
          this.agruparMateriasPorSemestre(); // Llama al método después de cargar el pensum
          console.log('Materias agrupadas por semestre:', this.materiasAgrupadasPorSemestre);
        },
        error: (error) => {
          console.error('Error al cargar el pensum:', error);
        },
      });
  
      this.MateriasService.getMaterias().subscribe({
        next: (response: any) => {
          if (response && response.materias) {
            this.materiasDisponibles = response.materias;
            console.log('Materias disponibles cargadas:', this.materiasDisponibles);
          } else {
            this.materiasDisponibles = [];
          }
        },
        error: (error) => {
          console.error('Error al cargar las materias:', error);
          this.materiasDisponibles = [];
        },
      });
    } else {
      console.warn('No se encontró pensumId en el estado.');
      this.router.navigate([`/${PATH.PENSUM}`]);
    }
  
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.materiaApensumForm = this.fb.group({
      _id: [this.pensumId, Validators.required],
      materiaAgregar: ['', Validators.required],
    });
  }

  agruparMateriasPorSemestre(): void {
    if (!this.pensum || !Array.isArray(this.pensum.materiaCodigo)) {
      return;
    }
  
    this.materiasAgrupadasPorSemestre = this.pensum.materiaCodigo.reduce(
      (acumulador: any, materia: any) => {
        if (!acumulador[materia.semestre]) {
          acumulador[materia.semestre] = [];
        }
        acumulador[materia.semestre].push({
          nombre: materia.nombre,
          estado: '',
        });
        return acumulador;
      },
      {}
    );
  
    console.log('Materias agrupadas por semestre:', this.materiasAgrupadasPorSemestre);
  }

  reloadPageWithPensum(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/pensum-detalle`], { state: { pensumId: this.pensumId } });
    });
  }
  
  

  eliminarMateria(item: { nombre: string }): void {
    const index = this.pensum.materiaCodigo.findIndex(
        (materia: any) => materia.nombre === item.nombre
    );

    if (index !== -1) {
        // Remueve la materia del array local
        this.pensum.materiaCodigo.splice(index, 1);

        // Actualiza el backend
        this.PensumsService.actualizarPensum(this.pensumId, {
            ...this.pensum,
            materiaCodigo: this.pensum.materiaCodigo,
        }).subscribe({
            next: (response: any) => {
                if (response?.pensum) {
                    // Actualizar el estado del pensum
                    this.pensum = response.pensum;
                    this.materiasAgrupadasPorSemestre = { ...this.materiasAgrupadasPorSemestre };
                    this.reloadPageWithPensum();
                    Swal.fire('Éxito', 'Materia eliminada del pensum.', 'success');
                } else {
                    Swal.fire('Error', 'No se pudo actualizar el pensum.', 'error');
                }
            },
            error: () => {
                Swal.fire('Error', 'No se pudo actualizar el pensum.', 'error');
            },
        });
    } else {
        Swal.fire('Error', 'Materia no encontrada.', 'error');
    }
} 
  modalCrearPensumD(): void {
    if (!this.materiaApensumForm) {
      this.inicializarFormulario(); // Asegúrate de que siempre esté inicializado
    }
    this.materiaApensumForm.reset({ _id: this.pensumId }); // Reinicia el formulario
    this.activarCrearPensumD = !this.activarCrearPensumD; // Alterna el estado del div
  }

  cargarDatos(pensumId: string): void {
    this.PensumsService.getUnPensum(pensumId).subscribe({
      next: (response: any) => {
        if (response && response.pensum) {
          this.pensum = response.pensum;
          console.log('Pensum cargado correctamente:', this.pensum);
        } else {
          console.warn('Estructura inesperada en la respuesta del backend:', response);
          this.pensum = { materiaCodigo: [] };
        }
      },
      error: (error) => {
        console.error('Error al cargar el pensum:', error);
        this.pensum = { materiaCodigo: [] };
      },
    });

    this.MateriasService.getMaterias().subscribe({
      next: (response: any) => {
        if (response && response.materias) {
          this.materiasDisponibles = response.materias;
          console.log('Estructura ESPERADA', this.materiasDisponibles);
          
          console.warn('Estructura ESPERADA:', response);
        } else {
          console.warn('Estructura inesperada en la respuesta del backend:', response);
          this.materiasDisponibles = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar las materias:', error);
        this.materiasDisponibles = [];
      },
    });
  }

  asignarMateriaAPensum(): void {
    if (this.materiaApensumForm.valid) {
      const materiaAgregar = this.materiaApensumForm.value.materiaAgregar;
  
      // Encuentra la materia seleccionada en las disponibles
      const materiaSeleccionada = this.materiasDisponibles.find(
        (materia) => materia._id === materiaAgregar
      );
  
      if (!materiaSeleccionada) {
        Swal.fire('Error', 'La materia seleccionada no es válida.', 'error');
        return;
      }
  
      // Crea una copia del array actual de materias
      const materiaCodigoActualizado = [...this.pensum.materiaCodigo, materiaSeleccionada];
  
      // Llama al servicio para actualizar el pensum
      this.PensumsService.actualizarPensum(this.pensumId, {
        ...this.pensum,
        materiaCodigo: materiaCodigoActualizado,
      }).subscribe({
        next: (response) => {
          if (response?.pensum) {
            // Reemplaza el objeto completo para disparar la detección de cambios
            this.pensum = {
              ...this.pensum,
              materiaCodigo: materiaCodigoActualizado,
            }; 
            Swal.fire('Éxito', 'Materia agregada al pensum.', 'success');
            this.reloadPageWithPensum();
          } else {
            Swal.fire('Error', 'No se pudo actualizar el pensum.', 'error');
          }
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar el pensum.', 'error');
        },
      });
    } else {
      Swal.fire('Error', 'Formulario inválido. Completa todos los campos.', 'error');
    }
  }
  

  getTituloSemestre(semestre: number): string {
    const ordinales = [
      'PRIMER SEMESTRE',
      'SEGUNDO SEMESTRE',
      'TERCER SEMESTRE',
      'CUARTO SEMESTRE',
      'QUINTO SEMESTRE',
      'SEXTO SEMESTRE',
      'SÉPTIMO SEMESTRE',
      'OCTAVO SEMESTRE',
      'NOVENO SEMESTRE',
      'DÉCIMO SEMESTRE',
      'UNDECIMO SEMESTRE',
      'DUODECIMO SEMESTRE',
    ];

    return ordinales[semestre - 1] || `${semestre}° SEMESTRE`;
  }

  getMateriasPorSemestre(semestre: number): { nombre: string; estado: string }[] {
    if (!this.pensum || !Array.isArray(this.pensum.materiaCodigo)) {
      console.warn(`Pensum o materiaCodigo no está definido para el semestre ${semestre}`);
      return [];
    }
  
    console.log(`Procesando materias para el semestre ${semestre}`, this.pensum.materiaCodigo);
  
    // Filtra las materias por semestre
    const materiasDelSemestre = this.pensum.materiaCodigo.filter(
      (materia: any) => materia.semestre === semestre
    );
  
    console.log(`Materias del semestre ${semestre}:`, materiasDelSemestre);
  
    // Mapea las materias al formato esperado
    return materiasDelSemestre.map((materia: any) => ({
      nombre: materia.nombre,
      estado: 'success', // Cambia el estado si es necesario
    }));
  }
  
}
