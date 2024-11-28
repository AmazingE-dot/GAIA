import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PensumsService } from '../../services/pensum/pensum.service';
import { CardsPensumComponent } from "../../components/shared/cards-pensum/cards-pensum.component";
import { PATH } from '../../core/enum/path.enum';

@Component({
  selector: 'app-pensum-detalle',
  templateUrl: './pensum-detalle.component.html',
  standalone: true,
  styleUrls: ['./pensum-detalle.component.css'],
  imports: [ CardsPensumComponent ],
})
export class PensumDetalleComponent implements OnInit {
  pensum: any;
  
  totalSemestres: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Array de semestres

  // Función para obtener el título del semestre (ordinal)
  getTituloSemestre(semestre: number): string {
    const ordinales = [
      "PRIMER SEMESTRE", 
      "SEGUNDO SEMESTRE", 
      "TERCER SEMESTRE", 
      "CUARTO SEMESTRE", 
      "QUINTO SEMESTRE", 
      "SEXTO SEMESTRE", 
      "SÉPTIMO SEMESTRE", 
      "OCTAVO SEMESTRE", 
      "NOVENO SEMESTRE", 
      "DÉCIMO SEMESTRE",
      "UNDECIMO SEMESTRE",
      "DUODECIMO SEMESTRE"
    ];

    return ordinales[semestre - 1] || `${semestre}° SEMESTRE`;
  }

  getMateriasPorSemestre(semestre: number): any[] {
    const materias = this.pensum?.pensum.materiaCodigo.filter(
      (materia: any) => materia.semestre === semestre
    );
    console.log('Materias por semestre', materias);  // Verifica los datos que llegan
    return materias;
  }
  
  

  constructor(private router: Router, private PensumsService: PensumsService) {}

  ngOnInit(): void {
    const pensumId = history.state?.pensumId; // Verifica si existe pensumId

    if (pensumId) {
      this.PensumsService.getUnPensum(pensumId).subscribe(
        (data) => {
          this.pensum = data;
        },
        (error) => {
          console.error('Error al obtener el pensum:', error);
        }
      );
    } else {
      console.warn('No se encontró pensumId en el estado.');
      this.router.navigate([`/${PATH.PENSUM}`]); // Redirige a la lista de pensums
    }
  }
}
